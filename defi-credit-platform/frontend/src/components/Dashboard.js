import React from 'react';
import {
  Box,
  Container,
  Grid,
  Heading,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Progress,
  VStack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';

const StatCard = ({ title, value, helpText }) => {
  return (
    <Box
      p={5}
      shadow="md"
      borderWidth="1px"
      borderRadius="lg"
      bg="yellow.200"
      borderColor="yellow.200"
    >
      <Stat>
        <StatLabel fontSize="lg" color="yellow.700">{title}</StatLabel>
        <StatNumber fontSize="2xl" color="yellow.700">{value}</StatNumber>
        <StatHelpText color="yellow.700">{helpText}</StatHelpText>
      </Stat>
    </Box>
  );
};

const ProgressSection = ({ title, value, max }) => {
  return (
    <Box>
      <Text mb={2} color="yellow.700">{title}</Text>
      <Progress value={(value / max) * 100} colorScheme="blue" />
      <Text mt={1} fontSize="sm" color="yellow.700">
        {value} / {max}
      </Text>
    </Box>
  );
};

const UserDashboard = ({ userData }) => {
  return (
    <Container maxW="container.xl" py={5} bg="black" color="yellow.700">
      <VStack spacing={8} align="stretch">
        <Heading size="lg">Personal Loan Status</Heading>
        <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6}>
          <StatCard
            title="Loan Amount"
            value={`$${userData.loanAmount}`}
            helpText={`Interest Rate: ${userData.interestRate}%`}
          />
          <StatCard
            title="Amount Repaid"
            value={`$${userData.repaidAmount}`}
            helpText={`Next Payment Date: ${userData.nextPaymentDate}`}
          />
          <StatCard
            title="Team Credit Score"
            value={userData.groupCreditScore}
            helpText={`Ranking: Top ${userData.groupRanking}%`}
          />
        </Grid>

        <Box mt={8}>
          <Heading size="md" mb={4}>Group Loan Status</Heading>
          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
            <Box>
              <ProgressSection
                title="Group Repayment Progress"
                value={userData.groupRepaidAmount}
                max={userData.groupTotalAmount}
              />
            </Box>
            <Box>
              <ProgressSection
                title="Credit Utilization"
                value={userData.creditUsed}
                max={userData.creditLimit}
              />
            </Box>
          </Grid>
        </Box>

        <Box mt={8}>
          <Heading size="md" mb={4}>Social Impact</Heading>
          <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6}>
            <ProgressSection
              title="Business Growth"
              value={30}
              max={100}
            />
            <ProgressSection
              title="Household Efficiency Improvement"
              value={40}
              max={100}
            />
            <ProgressSection
              title="Community Contribution"
              value={25}
              max={100}
            />
          </Grid>
        </Box>
      </VStack>
    </Container>
  );
};

export default UserDashboard;