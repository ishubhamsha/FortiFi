import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { 
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  useToast,
  VStack,
  HStack,
  Badge,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatGroup,
  useColorModeValue,
  Icon,
} from '@chakra-ui/react';
import { FaCoins, FaChartLine, FaLock, FaRegClock } from 'react-icons/fa';
import { Link as RouterLink } from 'react-router-dom';

const MIN_STAKE = "1000";
const REWARD_RATE = 1;

const Stake = () => {
  const [loading, setLoading] = useState(false);
  const [stakeAmount, setStakeAmount] = useState('');
  const [stakingInfo, setStakingInfo] = useState({
    totalStaked: '0',
    rewards: '0',
    lockPeriod: '30',
    apr: '5'
  });
  const toast = useToast();
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const highlightColor = useColorModeValue('yellow.500', 'yellow.300');

  // Contract integration placeholder
  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        // Add contract interaction here
        return true;
      }
      throw new Error('Please install MetaMask');
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
      });
      return false;
    }
  };

  const handleStake = async () => {
    if (!stakeAmount || parseFloat(stakeAmount) < parseFloat(MIN_STAKE)) {
      toast({
        title: 'Invalid amount',
        description: `Minimum stake is ${MIN_STAKE} EDU`,
        status: 'warning',
      });
      return;
    }

    try {
      setLoading(true);
      const connected = await connectWallet();
      if (!connected) return;

      // Add staking contract call here
      toast({
        title: 'Success',
        description: `Staked ${stakeAmount} EDU`,
        status: 'success',
      });
      setStakeAmount('');
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8}>
        <HStack w="full" justify="space-between">
          <Heading color={highlightColor}>Stake EDU Tokens</Heading>
          <Button as={RouterLink} to="/" variant="outline">
            Back to Home
          </Button>
        </HStack>

        <Stack 
          direction={{ base: 'column', lg: 'row' }} 
          spacing={8} 
          w="full" 
          align="stretch"
        >
          {/* Staking Stats */}
          <Box flex={1}>
            <VStack spacing={6}>
              <StatGroup 
                w="full" 
                bg={bgColor} 
                p={6} 
                borderRadius="lg" 
                borderWidth={1}
                borderColor={borderColor}
              >
                <Stat>
                  <StatLabel>Total Staked</StatLabel>
                  <StatNumber>{stakingInfo.totalStaked} EDU</StatNumber>
                  <StatHelpText>
                    <Icon as={FaCoins} mr={1} />
                    Your total stake
                  </StatHelpText>
                </Stat>

                <Stat>
                  <StatLabel>Rewards Earned</StatLabel>
                  <StatNumber>{stakingInfo.rewards} EDU</StatNumber>
                  <StatHelpText>
                    <Icon as={FaChartLine} mr={1} />
                    Current rewards
                  </StatHelpText>
                </Stat>
              </StatGroup>

              <Box 
                w="full" 
                bg={bgColor} 
                p={6} 
                borderRadius="lg" 
                borderWidth={1}
                borderColor={borderColor}
              >
                <VStack align="start" spacing={4}>
                  <Heading size="md">Staking Info</Heading>
                  <HStack>
                    <Icon as={FaLock} />
                    <Text>Lock Period: {stakingInfo.lockPeriod} days</Text>
                  </HStack>
                  <HStack>
                    <Icon as={FaRegClock} />
                    <Text>APR: {stakingInfo.apr}%</Text>
                  </HStack>
                </VStack>
              </Box>
            </VStack>
          </Box>

          {/* Staking Form */}
          <Box 
            flex={1} 
            p={6} 
            bg={bgColor} 
            borderRadius="lg" 
            borderWidth={1}
            borderColor={borderColor}
          >
            <VStack spacing={6}>
              <Heading size="md">Stake Tokens</Heading>
              <FormControl>
                <FormLabel>Amount to Stake (EDU)</FormLabel>
                <Input
                  type="number"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  placeholder={`Min ${MIN_STAKE} EDU`}
                />
              </FormControl>

              {parseFloat(stakeAmount) > 0 && (
                <Box 
                  w="full" 
                  p={4} 
                  bg="green.50" 
                  borderRadius="md"
                >
                  <Text color="green.600">
                    Estimated Annual Reward: {(parseFloat(stakeAmount) * REWARD_RATE / 100).toFixed(2)} EDU
                  </Text>
                </Box>
              )}

              <Button
                colorScheme="yellow"
                width="full"
                onClick={handleStake}
                isLoading={loading}
                loadingText="Staking..."
              >
                Stake EDU
              </Button>
            </VStack>
          </Box>
        </Stack>
      </VStack>
    </Container>
  );
};

export default Stake;
