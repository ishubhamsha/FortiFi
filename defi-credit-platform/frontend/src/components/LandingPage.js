import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Button,
  VStack,
  HStack,
  useColorModeValue,
  Icon,
  Divider,
  Badge,
  Image,
  Stack,
  Circle,
} from '@chakra-ui/react';
import {
  FaRobot,
  FaUserTie,
  FaChartLine,
  FaUsers,
  FaHandshake,
  FaBrain,
  FaLock,
  FaRegHandshake,
  FaClock,
  FaUserFriends,
  FaFemale,
} from 'react-icons/fa';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { default as BitcoinModel } from './BitcoinModel';  // Changed import statement

const Animate3DCard = ({ children }) => {
  const { scrollYProgress } = useScroll();
  const rotateX = useTransform(scrollYProgress, [0, 1], [20, 0]);
  const rotateY = useTransform(scrollYProgress, [0, 1], [-20, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0.3, 1]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);

  return (
    <motion.div
      style={{
        perspective: 1000,
        rotateX,
        rotateY,
        opacity,
        scale,
      }}
    >
      {children}
    </motion.div>
  );
};

const FeatureWithIcon = ({ title, text, icon, color = 'yellow.500', bg = 'yellow.100' }) => {
  const boxBg = useColorModeValue('yellow.100', 'yellow.700');
  const iconBg = useColorModeValue('black', 'gray.700');
  const textColor = useColorModeValue('yellow.500', 'yellow.300');

  return (
    <Animate3DCard>
      <Stack
        spacing={4}
        p={6}
        bg={boxBg}
        borderRadius="lg"
        position="relative"
        _hover={{
          bg: 'yellow.500',
          transform: 'translateY(-2px)',
          boxShadow: 'md',
        }}
        transition="all 0.2s"
        style={{
          transformStyle: 'preserve-3d',
          transform: 'translateZ(0)',
        }}
      >
        <Circle
          size={12}
          bg={iconBg}
          color={color}
          shadow="lg"
          position="relative"
        >
          <Icon as={icon} w={6} h={6} />
        </Circle>
        <Stack spacing={2}>
          <Heading size="md" color={useColorModeValue('yellow.800', 'yellow')}>
            {title}
          </Heading>
          <Text color={textColor}>{text}</Text>
        </Stack>
      </Stack>
    </Animate3DCard>
  );
};

const Feature = ({ title, text, icon, isHighlighted }) => {
  const bgColor = useColorModeValue('yellow.100', 'gray.800');
  const borderColorBase = useColorModeValue('yellow.200', 'gray.600');

  return (
    <Animate3DCard>
      <VStack
        p={6}
        shadow={isHighlighted ? 'lg' : 'md'}
        borderWidth="2px"
        borderColor={isHighlighted ? 'yellow.400' : borderColorBase}
        borderRadius="lg"
        bg={bgColor}
        _hover={{ transform: 'translateY(-5px)', shadow: 'xl' }}
        transition="all 0.3s"
        spacing={4}
        align="start"
        position="relative"
        style={{
          transformStyle: 'preserve-3d',
          transform: 'translateZ(0)',
        }}
      >
        {isHighlighted && (
          <Badge
            position="absolute"
            top="-2"
            right="-2"
            colorScheme="yellow"
            fontSize="sm"
            px={2}
            py={1}
            borderRadius="full"
          >
           AI Features
          </Badge>
        )}
        <Icon as={icon} w={8} h={8} color={isHighlighted ? 'yellow.400' : 'yellow.500'} />
        <Heading size="md" color="yellow.500">{title}</Heading>
        <Text color={useColorModeValue('yellow.600', 'yellow.400')}>{text}</Text>
      </VStack>
    </Animate3DCard>
  );
};

const ProcessStep = ({ number, title, description }) => (
  <HStack spacing={4} width="full" p={4}>
    <Box
      w={10}
      h={10}
      borderRadius="full"
      bg="yellow.400"
      color="black"
      display="flex"
      alignItems="center"
      justifyContent="center"
      fontSize="lg"
      fontWeight="bold"
    >
      {number}
    </Box>
    <VStack align="start" spacing={1}>
      <Heading size="sm" color="yellow.500">{title}</Heading>
      <Text color="yellow.600" fontSize="sm">
        {description}
      </Text>
    </VStack>
  </HStack>
);

const TypingText = () => {
  const words = ['Lend... ', 'Vote...', 'Borrow...', 'Grow...', 'Earn...', 'Succeed...'];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [text, setText] = useState('');
  const [delta, setDelta] = useState(50);

  useEffect(() => {
    let timer = setTimeout(() => {
      const currentWord = words[currentWordIndex];
      
      if (isDeleting) {
        setText(currentWord.substring(0, text.length - 1));
      } else {
        setText(currentWord.substring(0, text.length + 1));
      }

      if (!isDeleting && text === currentWord) {
        setTimeout(() => setIsDeleting(true), 1000);
      } else if (isDeleting && text === '') {
        setIsDeleting(false);
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
      }
    }, delta);

    return () => clearTimeout(timer);
  }, [text, isDeleting, currentWordIndex, delta]);

  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ color: '#ED8936' }}
    >
      {text}
    </motion.span>
  );
};

const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

const LandingPage = ({ onStartAssessment, onLogin }) => {
  const { scrollYProgress } = useScroll();
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <Box bg="black" minH="100vh">
      <Container maxW="container.xl" py={10}>
        <VStack spacing={16}>
          {/* Hero Section with 3D effect */}
          <motion.div
            style={{
              scale: heroScale,
              opacity: heroOpacity,
              width: '100%',
            }}
          >
            <Box id="hero" textAlign="center" w="full">
              <VStack spacing={6}>
                <Box
                  w="300px"
                  h="300px"
                  position="relative"
                  mb={4}
                >
                  {React.createElement(BitcoinModel)}
                </Box>
                <Heading
                  as="h1"
                  size="2xl"
                  bgGradient="linear(to-r, yellow.400, pink.400)"
                  backgroundClip="text"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  gap={2}
                >
                  FortiFi{" "}
                  <Box 
                    minW="200px" 
                    textAlign="left" 
                    bgGradient="linear(to-r, yellow.400, pink.400)"
                    bgClip="text"
                  >
                    <TypingText />
                  </Box>
                </Heading>
                <Text fontSize="xl" color="yellow.600" maxW="2xl">
                  The first decentralized microloan platform with AI-powered credit evaluation
                </Text>
              </VStack>
            </Box>
          </motion.div>

          {/* Add scroll-triggered animations to sections */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Box id="ai-process" w="full">
              <VStack spacing={8} align="start">
                <Heading size="lg" color="yellow.500">AI Smart Assessment Process</Heading>
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} w="full">
                  <ProcessStep
                    number="1"
                    title="AI Agent Interview"
                    description="An AI assistant conducts a natural conversation to assess your credit status"
                  />
                  <ProcessStep
                    number="2"
                    title="Multidimensional Analysis"
                    description="Comprehensive evaluation of your profession, income, social network, and more"
                  />
                  <ProcessStep
                    number="3"
                    title="Real-Time Credit Scoring"
                    description="AI generates an instant credit score based on the assessment"
                  />
                </SimpleGrid>
              </VStack>
            </Box>
          </motion.div>

          <Divider />

          {/* AI Features */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Box id="ai-features" w="full">
              <VStack spacing={8}>
                <Heading size="lg" color="yellow.500">AI Smart Evaluation</Heading>
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} width="full">
                  <Feature
                    icon={FaRobot}
                    title="AI-Powered Interview"
                    text="Skip the paperwork—just have a conversation with the AI assistant to complete your credit evaluation."
                    isHighlighted={true}
                  />
                  <Feature
                    icon={FaBrain}
                    title="Intelligent Credit Scoring"
                    text="AI analyzes responses in real-time to generate accurate credit scores, ensuring fairness."
                    isHighlighted={true}
                  />
                  <Feature
                    icon={FaUserTie}
                    title="Expert Consultation"
                    text="AI provides professional loan advice to help you make informed decisions."
                    isHighlighted={true}
                  />
                </SimpleGrid>
              </VStack>
            </Box>
          </motion.div>

          <Divider my={16} />

          {/* Platform Features */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Box id="platform-features" w="full">
              <VStack spacing={12}>
                <Heading size="lg" color="yellow.500">Platform Features</Heading>
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10} width="full">
                  <FeatureWithIcon
                    icon={FaLock}
                    title="No Collateral Loans"
                    text="Borrowers can access microloans based solely on credit, lowering entry barriers."
                    color="yellow.500"
                    bg="yellow.100"
                  />
                  <FeatureWithIcon
                    icon={FaUserFriends}
                    title="Group Lending Mechanism"
                    text="Borrowers form groups of 5-10 people, undergo collective review, and guarantee each other’s loans."
                    color="yellow.500"
                    bg="yellow.100"
                  />
                  <FeatureWithIcon
                    icon={FaClock}
                    title="Installment Repayments"
                    text="Loans are repaid in small, scheduled installments to prevent financial burden."
                    color="yellow.500"
                    bg="yellow.100"
                  />
                  <FeatureWithIcon
                    icon={FaRegHandshake}
                    title="Social Pressure & Trust Mechanism"
                    text="If one member defaults, the entire group’s credit is affected—encouraging timely repayments."
                    color="yellow.500"
                    bg="yellow.100"
                  />
                  <FeatureWithIcon
                    icon={FaFemale}
                    title="Women’s Empowerment"
                    text="Loans primarily support women, who often use funds for family and livelihood improvements."
                    color="yellow.500"
                    bg="yellow.100"
                  />
                  <FeatureWithIcon
                    icon={FaChartLine}
                    title="Credit Growth"
                    text="A good repayment history improves credit limits and borrowing conditions over time."
                    color="yellow.500"
                    bg="yellow.100"
                  />
                </SimpleGrid>
              </VStack>
            </Box>
          </motion.div>

          {/* CTA Section with 3D hover effect */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Box id="cta" py={10} textAlign="center">
              <VStack spacing={6}>
                <Heading size="lg" color="yellow.500">
                  Ready to Get Started?
                </Heading>
                <Text fontSize="lg" color="yellow.600">
                  Start your AI credit assessment now and unlock your credit potential
                </Text>
                <HStack spacing={4}>
                  <Button
                    size="lg"
                    colorScheme="yellow"
                    onClick={onStartAssessment} // Changed this line
                    leftIcon={<FaRobot />}
                    px={8}
                  >
                    Start AI Interview
                  </Button>
                  <Button
                    variant="outline"
                    colorScheme="yellow"
                    size="lg"
                    onClick={onLogin}
                  >
                    Login to Management Platform
                  </Button>
                </HStack>
              </VStack>
            </Box>
          </motion.div>
        </VStack>
      </Container>
    </Box>
  );

};

export default LandingPage;