import React from 'react';
import { Box, HStack, VStack } from '@gluestack-ui/themed';

export const SkeletonCard = () => {
  return (
    <Box 
      p="$5" 
      bg="$white" 
      borderRadius="$2xl" 
      mb="$4" 
      borderWidth={1}
      borderColor="rgba(0,0,0,0.03)"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2
      }}
    >
      <HStack justifyContent="space-between" alignItems="flex-start" mb="$4">
        <VStack space="xs" flex={1}>
          <Box h="$6" w="70%" borderRadius="$md" bg="$backgroundLight100" />
          <Box h="$4" w="40%" borderRadius="$sm" bg="$backgroundLight100" />
        </VStack>
        <Box h="$7" w="$20" borderRadius="$full" bg="$backgroundLight100" />
      </HStack>
      
      <VStack space="xs" mb="$4">
        <Box h="$4" w="100%" borderRadius="$sm" bg="$backgroundLight100" />
        <Box h="$4" w="90%" borderRadius="$sm" bg="$backgroundLight100" />
      </VStack>
      
      <Box h={180} w="100%" borderRadius="$xl" bg="$backgroundLight100" mb="$4" />
      
      <HStack justifyContent="space-between" alignItems="center">
        <Box h="$4" w="30%" borderRadius="$sm" bg="$backgroundLight100" />
        <Box h="$5" w="15%" borderRadius="$full" bg="$backgroundLight100" />
      </HStack>
    </Box>
  );
};

