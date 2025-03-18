import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Button,
  useColorModeValue,
  Progress,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Grid,
  Badge,
  useToast,
} from '@chakra-ui/react';

const Repayment = ({ contract, account }) => {
  const [loading, setLoading] = useState(false);
  const [loanDetails, setLoanDetails] = useState(null);
  const toast = useToast();
  
  const bgColor = useColorModeValue('black', 'black');
  const borderColor = useColorModeValue('yellow.200', 'yellow.800');
  const textColor = useColorModeValue('yellow.500', 'yellow.300');

  useEffect(() => {
    fetchLoanDetails();
  }, [contract, account]);

  const fetchLoanDetails = async () => {
    try {
      if (!contract || !account) return;
      setLoading(true);
      
      // Replace these with your actual contract calls
      const loan = await contract.methods.getLoanDetails(account).call();
      const paid = await contract.methods.getAmountPaid(account).call();
      
      setLoanDetails({
        amount: loan.amount,
        interestRate: loan.interestRate,
        nextPayment: loan.nextPaymentDate,
        remainingPayments: loan.remainingPayments,
        amountPaid: paid,
        totalAmount: loan.totalAmount,
      });
    } catch (error) {
      console.error('Error fetching loan details:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch loan details',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMakePayment = async () => {
    try {
      setLoading(true);
      // Replace with your actual payment contract call
      await contract.methods.makePayment().send({ from: account });
      
      toast({
        title: 'Success',
        description: 'Payment successful',
        status: 'success',
        duration: 5000,
      });
      
      fetchLoanDetails(); // Refresh loan details
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: 'Error',
        description: 'Payment failed',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!loanDetails) {
    return <Container maxW="container.xl" py={8}><Text color={textColor}>Loading loan details...</Text></Container>;
  }

  // Calculate progress percentage
  const progressValue = (parseFloat(loanDetails.amountPaid) / parseFloat(loanDetails.totalAmount)) * 100;

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8}>
        <Heading color={textColor}>Loan Repayment Dashboard</Heading>
        
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6} w="full">
          <Box
            p={6}
            borderWidth="1px"
            borderRadius="lg"
            bg={bgColor}
            borderColor={borderColor}
          >
            <VStack align="stretch" spacing={4}>
              <Heading size="md" color={textColor}>Repayment Progress</Heading>
              <Progress 
                value={progressValue} 
                colorScheme="yellow" 
                size="lg" 
                borderRadius="full" 
              />
              <Text color={textColor}>
                {loanDetails.amountPaid} paid of {loanDetails.totalAmount}
              </Text>
              <Badge colorScheme="yellow">Next Payment: {loanDetails.nextPayment}</Badge>
            </VStack>
          </Box>

          <Box
            p={6}
            borderWidth="1px"
            borderRadius="lg"
            bg={bgColor}
            borderColor={borderColor}
          >
            <VStack align="stretch" spacing={4}>
              <Heading size="md" color={textColor}>Loan Details</Heading>
              <Stat>
                <StatLabel color={textColor}>Interest Rate</StatLabel>
                <StatNumber color={textColor}>{loanDetails.interestRate}</StatNumber>
                <StatHelpText color={textColor}>Fixed Rate</StatHelpText>
              </Stat>
              <Button 
                colorScheme="yellow" 
                size="lg" 
                onClick={handleMakePayment}
                isLoading={loading}
                loadingText="Processing Payment"
              >
                Make Payment
              </Button>
            </VStack>
          </Box>
        </Grid>
      </VStack>
    </Container>
  );
};

export default Repayment;
