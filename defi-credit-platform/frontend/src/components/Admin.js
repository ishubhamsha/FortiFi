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
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useColorModeValue,
} from '@chakra-ui/react';

const StatCard = ({ title, value, helpText, colorScheme = 'blue' }) => {
  return (
    <Box
      p={5}
      shadow="md"
      borderWidth="1px"
      borderRadius="lg"
      bg="black"
      borderColor={`${colorScheme}.200`}
    >
      <Stat>
        <StatLabel fontSize="lg" color="yellow.500">{title}</StatLabel>
        <StatNumber fontSize="2xl" color={`${colorScheme}.500`}>{value}</StatNumber>
        <StatHelpText color="yellow.500">{helpText}</StatHelpText>
      </Stat>
    </Box>
  );
};

const Admin = () => {
  const bgColor = 'black';
  const borderColor = 'yellow.200';
  const textColor = 'yellow.500';

  return (
    <Container maxW="container.xl" py={5}>
      <VStack spacing={8} align="stretch">
        <Heading size="lg" color={textColor}>Platform Operations Overview</Heading>
        
        <Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap={6}>
          <StatCard
            title="Total Active Loans"
            value="$1,250,000"
            helpText="Up 12% from last month"
            colorScheme="blue"
          />
          <StatCard
            title="Default Rate This Month"
            value="2.3%"
            helpText="Down 0.5% from last month"
            colorScheme="green"
          />
          <StatCard
            title="New Borrowers"
            value="156"
            helpText="Added this month"
            colorScheme="purple"
          />
          <StatCard
            title="Average Credit Score"
            value="85"
            helpText="Up 3 points from last month"
            colorScheme="orange"
          />
        </Grid>

        <Box mt={8}>
          <Heading size="md" mb={4}>Emergency Operations</Heading>
          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
            <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg">
              <Heading size="sm" mb={4}>High-Risk Loan Groups</Heading>
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th>Group ID</Th>
                    <Th>Risk Level</Th>
                    <Th>Days Overdue</Th>
                    <Th>Outstanding Amount</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td>G001</Td>
                    <Td color="red.500">High</Td>
                    <Td>15</Td>
                    <Td>$2,500</Td>
                  </Tr>
                  <Tr>
                    <Td>G008</Td>
                    <Td color="orange.500">Medium</Td>
                    <Td>7</Td>
                    <Td>$1,800</Td>
                  </Tr>
                </Tbody>
              </Table>
            </Box>

            <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg">
              <Heading size="sm" mb={4}>System Health Status</Heading>
              <VStack spacing={4} align="stretch">
                <Box>
                  <Text mb={2}>Smart Contract Execution Success Rate</Text>
                  <Progress value={98} colorScheme="green" />
                </Box>
                <Box>
                  <Text mb={2}>Credit Evaluation System Response Time</Text>
                  <Progress value={85} colorScheme="blue" />
                </Box>
                <Box>
                  <Text mb={2}>Liquidity in Funding Pool</Text>
                  <Progress value={75} colorScheme="orange" />
                </Box>
              </VStack>
            </Box>
          </Grid>
        </Box>

        <Box mt={8}>
          <Heading size="md" mb={4}>Social Impact Metrics</Heading>
          <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6}>
            <StatCard
              title="Women Entrepreneurs Percentage"
              value="68%"
              helpText="Goal: 70%"
              colorScheme="pink"
            />
            <StatCard
              title="Household Income Growth"
              value="45%"
              helpText="Average Increase"
              colorScheme="green"
            />
            <StatCard
              title="Community Development Projects"
              value="23"
              helpText="Ongoing Projects"
              colorScheme="purple"
            />
          </Grid>
        </Box>
      </VStack>
    </Container>
  );
};

export default Admin;
