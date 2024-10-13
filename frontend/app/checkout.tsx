import React from 'react';
import { View, Button, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { useStripe } from '@stripe/stripe-react-native';

export default function CheckoutScreen() {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState(null);

  const API_URL = "http://localhost:3000"

  const fetchPaymentSheetParams = async () => {
    const response = await fetch(`${API_URL}/payment-sheet`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerId: null, // Send null for guest checkout
      }),
    });
    const { paymentIntent, ephemeralKey, customer } = await response.json();

    return {
      paymentIntent,
      ephemeralKey,
      customer,
    };
  };

  const initializePaymentSheet = async () => {
    const {
      paymentIntent,
      ephemeralKey,
      customer,
    } = await fetchPaymentSheetParams();

    const { error } = await initPaymentSheet({
      merchantDisplayName: "Crowd",
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      applePay: {
        merchantCountryCode: 'US',
      },
      allowsDelayedPaymentMethods: false,
      defaultBillingDetails: {
        name: 'Jane Doe',
      }
    });
    if (!error) {
      setLoading(true);
    }
  };

  const generateQRCode = async paymentIntentId => {
    try {
      const response = await fetch(`${API_URL}/create-ticket`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentIntentId }),
      });

      const data = await response.json();

      if (data.success) {
        setQrCode(data.qrCode);
      } else {
        Alert.alert('Error', 'Failed to generate QR code');
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
      Alert.alert('Error', 'Failed to generate QR code');
    }
  };

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();
    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      Alert.alert('Success', 'Your order is confirmed! Check your email for your ticket.');
    }
  };

  useEffect(() => {
    initializePaymentSheet();
  }, []);

  return (
    <View>
      <Button
        variant="primary"
        disabled={!loading}
        title="Checkout"
        onPress={openPaymentSheet}
      />
    </View>
  );
}