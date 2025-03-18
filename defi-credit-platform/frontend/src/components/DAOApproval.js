import React from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  useColorModeValue,
  Container,
  HStack,
  Badge,
  Card,
  CardHeader,
  CardBody,
  Progress,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Divider,
  SimpleGrid,
} from '@chakra-ui/react';
import { FaCheckCircle, FaClock, FaChartLine, FaEthereum, FaUsers, FaHandshake, FaBolt, FaDatabase, FaCoins } from 'react-icons/fa';

function DAOApproval() {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const headingColor = useColorModeValue('blue.600', 'blue.300');

  return (
    <Container maxW="container.xl">
      <VStack spacing={6} align="stretch">
        {/* Status Card */}
        <Box
          p={6}
          borderRadius="lg"
          bg={bgColor}
          borderColor={borderColor}
          borderWidth="1px"
          position="relative"
          overflow="hidden"
        >
         <Box
  position="absolute"
  top="0"
  right="0"
  width="200px"
  height="200px"
  bgGradient="radial(pink.50, transparent)"
  opacity="0.4"
  transform="translate(30%, -30%)"
/>
<VStack spacing={4} align="stretch">
  <HStack justify="space-between">
    <VStack align="start" spacing={1}>
      <Heading size="md">DAO Approval Status</Heading>
      <Text color="gray.500">The loan application is under review by DAO members</Text>
    </VStack>
    <Badge colorScheme="yellow" p={2} borderRadius="lg">
      <HStack spacing={2}>
        <FaClock />
        <Text>Under Review</Text>
      </HStack>
    </Badge>
  </HStack>
  <Box pt={4}>
    <Text mb={2}>Approval Progress</Text>
    <Progress value={40} colorScheme="blue" borderRadius="full" />
    <HStack justify="space-between" mt={2}>
      <Text color="gray.500">Received 4/10 votes</Text>
      <Text color="gray.500">Needs 6 more votes to pass</Text>
    </HStack>
  </Box>
</VStack>
</Box>


        {/* Combined Stats */}
        <Box
          p={6}
          borderRadius="lg"
          bg={bgColor}
          borderColor={borderColor}
          borderWidth="1px"
          mb={6}
          position="relative"
          overflow="hidden"
        >
          <Box
            position="absolute"
            top="0"
            right="0"
            width="300px"
            height="300px"
            bgGradient="radial(blue.50, transparent)"
            opacity="0.6"
            transform="translate(30%, -30%)"
            zIndex="0"
          />
          <VStack spacing={8}>
            {/* Network Stats */}
            <VStack spacing={4} width="100%">
              <Heading size="md" display="flex" alignItems="center" gap={2}>
                <FaEthereum />
                BASE Network Statistics
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} width="100%">
                <Stat
                  p={4}
                  bg={useColorModeValue('blue.50', 'blue.900')}
                  borderRadius="lg"
                  position="relative"
                  overflow="hidden"
                >
                  <Box
                    position="absolute"
                    top="0"
                    right="0"
                    width="40px"
                    height="40px"
                    bg={useColorModeValue('blue.100', 'blue.800')}
                    transform="translate(30%, -30%) rotate(45deg)"
                  />
                  <StatLabel display="flex" alignItems="center" gap={2}>
                    <FaDatabase color={useColorModeValue('blue.500', 'blue.200')} />
                    BASE TVL
                  </StatLabel>
                  <StatNumber>$2.5B</StatNumber>
                  <StatHelpText>Total Value Locked</StatHelpText>
                </Stat>
                <Stat
                  p={4}
                  bg={useColorModeValue('green.50', 'green.900')}
                  borderRadius="lg"
                  position="relative"
                  overflow="hidden"
                >
                  <Box
                    position="absolute"
                    top="0"
                    right="0"
                    width="40px"
                    height="40px"
                    bg={useColorModeValue('green.100', 'green.800')}
                    transform="translate(30%, -30%) rotate(45deg)"
                  />
                  <StatLabel display="flex" alignItems="center" gap={2}>
                    <FaCoins color={useColorModeValue('green.500', 'green.200')} />
                    Gas Fee (GWEI)
                  </StatLabel>
                  <StatNumber>0.001</StatNumber>
                  <StatHelpText>Ultra-low gas fees</StatHelpText>
                </Stat>
                <Stat
                  p={4}
                  bg={useColorModeValue('purple.50', 'purple.900')}
                  borderRadius="lg"
                  position="relative"
                  overflow="hidden"
                >
                  <Box
                    position="absolute"
                    top="0"
                    right="0"
                    width="40px"
                    height="40px"
                    bg={useColorModeValue('purple.100', 'purple.800')}
                    transform="translate(30%, -30%) rotate(45deg)"
                  />
                  <StatLabel display="flex" alignItems="center" gap={2}>
                    <FaBolt color={useColorModeValue('purple.500', 'purple.200')} />
                    Transaction Speed
                  </StatLabel>
                  <StatNumber>2s</StatNumber>
                  <StatHelpText>Average confirmation time</StatHelpText>
                </Stat>
              </SimpleGrid>
            </VStack>

            <Divider />

            {/* Protocol Stats */}
            <VStack spacing={4} width="100%">
              <Heading size="md" display="flex" alignItems="center" gap={2}>
                <FaChartLine />
                Protocol Metrics
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} width="100%">
                <Stat
                  p={4}
                  bg={useColorModeValue('teal.50', 'teal.900')}
                  borderRadius="lg"
                  position="relative"
                  overflow="hidden"
                >
                  <Box
                    position="absolute"
                    top="0"
                    right="0"
                    width="40px"
                    height="40px"
                    bg={useColorModeValue('teal.100', 'teal.800')}
                    transform="translate(30%, -30%) rotate(45deg)"
                  />
                  <StatLabel display="flex" alignItems="center" gap={2}>
                    <FaHandshake color={useColorModeValue('teal.500', 'teal.200')} />
                    Total Loans
                  </StatLabel>
                  <StatNumber>1,234</StatNumber>
                  <StatHelpText>Active loans on BASE</StatHelpText>
                </Stat>
                <Stat
                  p={4}
                  bg={useColorModeValue('orange.50', 'orange.900')}
                  borderRadius="lg"
                  position="relative"
                  overflow="hidden"
                >
                  <Box
                    position="absolute"
                    top="0"
                    right="0"
                    width="40px"
                    height="40px"
                    bg={useColorModeValue('orange.100', 'orange.800')}
                    transform="translate(30%, -30%) rotate(45deg)"
                  />
                  <StatLabel display="flex" alignItems="center" gap={2}>
                    <FaCheckCircle color={useColorModeValue('orange.500', 'orange.200')} />
                    Success Rate
                  </StatLabel>
                  <StatNumber>98.5%</StatNumber>
                  <StatHelpText>Loan repayment rate</StatHelpText>
                </Stat>
                <Stat
                  p={4}
                  bg={useColorModeValue('cyan.50', 'cyan.900')}
                  borderRadius="lg"
                  position="relative"
                  overflow="hidden"
                >
                  <Box
                    position="absolute"
                    top="0"
                    right="0"
                    width="40px"
                    height="40px"
                    bg={useColorModeValue('cyan.100', 'cyan.800')}
                    transform="translate(30%, -30%) rotate(45deg)"
                  />
                  <StatLabel display="flex" alignItems="center" gap={2}>
                    <FaCoins color={useColorModeValue('cyan.500', 'cyan.200')} />
                    DAO Treasury
                  </StatLabel>
                  <StatNumber>500K USDC</StatNumber>
                  <StatHelpText>Available for lending</StatHelpText>
                </Stat>
              </SimpleGrid>
            </VStack>
          </VStack>
        </Box>

        {/* BASE Advantages */}
        <Box
          p={6}
          borderRadius="lg"
          bg={bgColor}
          borderColor={borderColor}
          borderWidth="1px"
          position="relative"
          overflow="hidden"
        >
          <Box
            position="absolute"
            top="0"
            right="0"
            width="300px"
            height="300px"
            bgGradient="radial(pink.50, transparent)"
            opacity="0.4"
            transform="translate(30%, -30%)"
          />
          <VStack spacing={6} align="stretch">
            <Heading size="md" display="flex" alignItems="center" gap={2}>
              <Box as={FaEthereum} color="blue.500" />
              Why BASE Network?
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
              <Box
                p={4}
                bg={useColorModeValue('green.50', 'green.900')}
                borderRadius="lg"
                position="relative"
                overflow="hidden"
                transition="transform 0.2s"
                _hover={{ transform: 'scale(1.02)' }}
              >
                <Box
                  position="absolute"
                  top="0"
                  right="0"
                  width="40px"
                  height="40px"
                  bg={useColorModeValue('green.100', 'green.800')}
                  transform="translate(30%, -30%) rotate(45deg)"
                />
                <VStack align="start" spacing={3}>
                  <HStack color="green.500" fontSize="lg">
                    <FaEthereum />
                    <Text fontWeight="bold">Ethereum L2 Security</Text>
                  </HStack>
                  <Text>Inherits Ethereum's robust security while offering faster and cheaper transactions</Text>
                </VStack>
              </Box>

              <Box
                p={4}
                bg={useColorModeValue('blue.50', 'blue.900')}
                borderRadius="lg"
                position="relative"
                overflow="hidden"
                transition="transform 0.2s"
                _hover={{ transform: 'scale(1.02)' }}
              >
                <Box
                  position="absolute"
                  top="0"
                  right="0"
                  width="40px"
                  height="40px"
                  bg={useColorModeValue('blue.100', 'blue.800')}
                  transform="translate(30%, -30%) rotate(45deg)"
                />
                <VStack align="start" spacing={3}>
                  <HStack color="blue.500" fontSize="lg">
                    <FaUsers />
                    <Text fontWeight="bold">Growing Ecosystem</Text>
                  </HStack>
                  <Text>Part of the rapidly expanding BASE ecosystem with increasing TVL and user adoption</Text>
                </VStack>
              </Box>

              <Box
                p={4}
                bg={useColorModeValue('purple.50', 'purple.900')}
                borderRadius="lg"
                position="relative"
                overflow="hidden"
                transition="transform 0.2s"
                _hover={{ transform: 'scale(1.02)' }}
              >
                <Box
                  position="absolute"
                  top="0"
                  right="0"
                  width="40px"
                  height="40px"
                  bg={useColorModeValue('purple.100', 'purple.800')}
                  transform="translate(30%, -30%) rotate(45deg)"
                />
                <VStack align="start" spacing={3}>
                  <HStack color="purple.500" fontSize="lg">
                    <FaHandshake />
                    <Text fontWeight="bold">Community Governance</Text>
                  </HStack>
                  <Text>True decentralization with community-driven decision making and transparent voting</Text>
                </VStack>
              </Box>
            </SimpleGrid>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
}

export default DAOApproval;
