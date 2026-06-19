import { Tabs } from 'expo-router'
import React from 'react'

import { HapticTab } from '@/components/haptic-tab'
import { IconSymbol } from '@/components/ui/icon-symbol'

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,

        tabBarActiveTintColor: '#22D3EE',
        tabBarInactiveTintColor: '#64748B',

        tabBarStyle: {
          backgroundColor: '#07111F',
          borderTopColor: 'rgba(34,211,238,0.12)',
          height: 84,
          paddingTop: 8,
        },

        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '800',
          marginTop: 4,
        },
      }}
    >

      <Tabs.Screen
        name="index"
        options={{
          title: 'الرئيسية',

          tabBarIcon: ({ color }) => (
            <IconSymbol
              size={24}
              name="house.fill"
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{
          title: 'المدن',

          tabBarIcon: ({ color }) => (
            <IconSymbol
              size={24}
              name="map.fill"
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="alerts"
        options={{
          title: 'التنبيهات',

          tabBarIcon: ({ color }) => (
            <IconSymbol
              size={24}
              name="bell.fill"
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="analytics"
        options={{
          title: 'التحليلات',

          tabBarIcon: ({ color }) => (
            <IconSymbol
              size={24}
              name="chart.bar.fill"
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="ai"
        options={{
          title: 'الذكاء',

          tabBarIcon: ({ color }) => (
            <IconSymbol
              size={24}
              name="sparkles"
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: 'الإعدادات',

          tabBarIcon: ({ color }) => (
            <IconSymbol
              size={24}
              name="gearshape.fill"
              color={color}
            />
          ),
        }}
      />

    </Tabs>
  )
}