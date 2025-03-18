import React from 'react';
import {
  Box,
  Grid,
  GridItem,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  VStack,
  HStack,
  Text,
  Progress,
  Heading,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Card,
  CardHeader,
  CardBody,
  useColorModeValue,
} from '@chakra-ui/react';

const UserDashboard = ({ account, loanData = {} }) => {
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const cardBg = useColorModeValue('yellow.200', 'yellow.700');

  const teamData = {
    teamName: "Entrepreneurs Alliance",
    members: 8,
    totalLoans: 50000,
    repaidLoans: 35000,
    nextPayment: "2025-03-01",
    creditScore: 85,
    repaymentRate: 95,
    loanHistory: [
      { date: "2025-01-15", amount: 10000, status: "Paid Off" },
      { date: "2025-02-01", amount: 15000, status: "In Repayment" },
      { date: "2025-02-15", amount: 25000, status: "Under Review" },
    ]
  };

  return (
    <Box bg="black" color="black" minH="100vh" p={4}>
      <VStack spacing={6} align="stretch" w="full">
        {/* Personal Information Overview */}
        <Grid templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(3, 1fr)" }} gap={6}>
          <GridItem colSpan={1}>
            <Card bg={cardBg} borderColor={borderColor} borderWidth="1px">
              <CardHeader pb={0}>
                <Heading size="md" color="yellow.900">Personal Credit Score</Heading>
              </CardHeader>
              <CardBody>
                <VStack align="center" spacing={4}>
                  <Box position="relative" display="inline-block">
                    <Text
                      position="absolute"
                      top="50%"
                      left="50%"
                      transform="translate(-50%, -50%)"
                      fontSize="2xl"
                      fontWeight="bold"
                      color="yellow.800"
                    >
                      {teamData.creditScore}
                    </Text>
                    <CircularProgressWithScore value={teamData.creditScore} />
                  </Box>
                  <Badge colorScheme="green">Good Credit</Badge>
                </VStack>
              </CardBody>
            </Card>
          </GridItem>

          <GridItem colSpan={1}>
            <Card bg={cardBg} borderColor={borderColor} borderWidth="1px">
              <CardHeader pb={0}>
                <Heading size="md" color="yellow.900">Team Repayment Status</Heading>
              </CardHeader>
              <CardBody>
                <VStack spacing={4}>
                  <Stat>
                    <StatLabel color="yellow.600">Team Repayment Rate</StatLabel>
                    <StatNumber color="yellow.800">{teamData.repaymentRate}%</StatNumber>
                    <StatHelpText color="yellow.600">
                      <StatArrow type="increase" />
                      Increased by 2.3% from last month
                    </StatHelpText>
                  </Stat>
                  <Progress
                    value={teamData.repaymentRate}
                    colorScheme="blue"
                    size="lg"
                    width="100%"
                  />
                </VStack>
              </CardBody>
            </Card>
          </GridItem>

          <GridItem colSpan={1}>
            <Card bg={cardBg} borderColor={borderColor} borderWidth="1px">
              <CardHeader pb={0}>
                <Heading size="md" color="yellow.900">Next Payment</Heading>
              </CardHeader>
              <CardBody>
                <VStack spacing={4}>
                  <Stat>
                    <StatLabel color="red.500">Repayment Date</StatLabel>
                    <StatNumber color="yellow.800">{teamData.nextPayment}</StatNumber>
                    <StatHelpText color="red.900">
                      12 days remaining
                    </StatHelpText>
                  </Stat>
                  <HStack justify="space-between" width="100%">
                    <Text color="yellow.800">Amount Due:</Text>
                    <Text fontWeight="bold" color="yellow.800">5,000 USDT</Text>
                  </HStack>
                </VStack>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>

        {/* Team Information */}
        <Card bg={cardBg} borderColor={borderColor} borderWidth="1px">
          <CardHeader>
            <Heading size="md" color="yellow.900">Team Information</Heading>
          </CardHeader>
          <CardBody>
            <Grid templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }} gap={6}>
              <Stat>
                <StatLabel color="yellow.800">Team Name</StatLabel>
                <StatNumber fontSize="xl" color="yellow.800">{teamData.teamName}</StatNumber>
              </Stat>
              <Stat>
                <StatLabel color="yellow.800">Number of Members</StatLabel>
                <StatNumber fontSize="xl" color="yellow.800">{teamData.members} people</StatNumber>
              </Stat>
              <Stat>
                <StatLabel color="yellow.800">Total Loans</StatLabel>
                <StatNumber fontSize="xl" color="yellow.800">{teamData.totalLoans} USDT</StatNumber>
              </Stat>
              <Stat>
                <StatLabel color="yellow.800">Repaid Amount</StatLabel>
                <StatNumber fontSize="xl" color="yellow.800">{teamData.repaidLoans} USDT</StatNumber>
              </Stat>
            </Grid>
          </CardBody>
        </Card>

        {/* Loan History */}
        <Card bg={cardBg} borderColor={borderColor} borderWidth="1px">
          <CardHeader>
            <Heading size="md" color="yellow.900">Loan History</Heading>
          </CardHeader>
          <CardBody>
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th color="yellow.800">Date</Th>
                    <Th color="yellow.800">Amount (USDT)</Th>
                    <Th color="yellow.800">Status</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {teamData.loanHistory.map((loan, index) => (
                    <Tr key={index}>
                      <Td><Text color="green.400">{loan.date}</Text></Td>
                      <Td><Text color="blue.500">{loan.amount}</Text></Td>
                      <Td>
                        <Badge
                          colorScheme={
                            loan.status === "Paid Off" ? "green" :
                            loan.status === "In Repayment" ? "yellow" :
                            "blue"
                          }
                        >
                          {loan.status}
                        </Badge>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
};

// 圆形进度条组件
const CircularProgressWithScore = ({ value }) => {
  const size = 120;
  const thickness = 8;
  const angle = (value / 100) * 360;
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = (angle / 360) * circumference;
  const gradient = useColorModeValue(
    "linear-gradient(45deg, #48BB78, #4299E1)",
    "linear-gradient(45deg, #68D391, #63B3ED)"
  );

  return (
    <Box position="relative" width={size} height={size}>
      <svg width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={useColorModeValue("gray.100", "gray.600")}
          strokeWidth={thickness}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={gradient}
          strokeWidth={thickness}
          strokeDasharray={`${strokeDasharray} ${circumference}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{
            transition: "stroke-dasharray 0.5s ease",
          }}
        />
      </svg>
    </Box>
  );
};

export default UserDashboard;