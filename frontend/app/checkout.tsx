import React from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { useAuth0 } from 'react-native-auth0';
import { useStripe } from '@stripe/stripe-react-native';
import { Stack, useLocalSearchParams } from 'expo-router';

export default function CheckoutScreen() {
  const params = useLocalSearchParams();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const { getCredentials } = useAuth0();
  console.log(getCredentials);

  const fetchPaymentSheetParams = async (cost) => {
    const credentials = await getCredentials();
    const response = await fetch(`http://localhost:3000/payment-sheet`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${credentials.accessToken}`,
      },
      body: JSON.stringify({
        cost: cost
      }),
    });
    const { paymentIntent, ephemeralKey, customer } = await response.json();
    
    return {
      paymentIntent,
      ephemeralKey,
      customer,
    };
  };

  const initializePaymentSheet = async (cost) => {
    const {
      paymentIntent,
      ephemeralKey,
      customer,
    } = await fetchPaymentSheetParams(cost);

    const { error } = await initPaymentSheet({
      merchantDisplayName: "Crowd",
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      applePay: {
        merchantCountryCode: "US",
      },
      allowsDelayedPaymentMethods: false,
      defaultBillingDetails: {
        name: "Jane Doe",
      },
    });
    if (!error) {
      setLoading(true);
    }
  };

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();
    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      Alert.alert(
        "Success",
        "Your order is confirmed! Check your email for your ticket."
      );
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const credentials = await getCredentials();
        setIsLoggedIn(credentials !== undefined);
      } catch (error) {
        console.error('Error checking credentials:', error);
      } finally {
        setLoading(false);
      }
    })();
    initializePaymentSheet(params.cost == undefined ? 50 : parseInt(params.cost));
  }, []);

  if (!isLoggedIn) {
    return (
      <>  
        <Stack.Screen 
          options={{
            headerBackTitle: "Back",
            title: "Checkout"
          }} 
        />
        <View className="flex items-center justify-center h-full">
          <Text>Please login to checkout</Text>
        </View>
      </>
    )
  }
  return (
    <>
      <Stack.Screen 
        options={{
          headerBackTitle: "Back",
          title: "Checkout"
        }} 
      />
      <View className="flex w-full h-2/3 items-center justify-center">
        <View className="flex gap-4">
          <Text className="text-5xl">🛒 Your cart</Text>
          <Text className="text-lg">🎟️ One ticket to {params.title}</Text>
          <Text className="">Subtotal: ${params.cost == undefined ? "0.50" : parseInt(params.cost) / 100}</Text>
          <Button
            variant="primary"
            disabled={!loading}
            title="Checkout"
            onPress={openPaymentSheet}
          />
        </View>
      </View>
    </>
  );
}
