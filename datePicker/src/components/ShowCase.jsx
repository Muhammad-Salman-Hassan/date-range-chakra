import {
    Box,
    Flex,
    Heading,
    Text,
    Container,
    Divider,
    useColorMode,
    IconButton,
    VStack,
  } from "@chakra-ui/react";
  
  import CustomDateRangePicker from "./DateTimePicker";
  import CodeViewer from "./CodeViewer";
  import LivePreview from "./LivePreview";
  
  import { FaMoon, FaSun } from "react-icons/fa";
  import { useState } from "react";
  
  export default function ShowcasePage() {
    const { colorMode, toggleColorMode } = useColorMode();
  
    const [editedCode, setEditedCode] = useState("");
  
    return (
      <Box>
        {/* -------- NAVBAR -------- */}
        <Flex
          justify="space-between"
          align="center"
          px={8}
          py={4}
          borderBottom="1px solid"
          borderColor="gray.200"
        >
          <Heading size="md">DateRangePicker</Heading>
          <IconButton
            icon={colorMode === "light" ? <FaMoon /> : <FaSun />}
            onClick={toggleColorMode}
            variant="ghost"
          />
        </Flex>
  
        {/* -------- HERO -------- */}
        <Container maxW="5xl" textAlign="center" py={20}>
          <Heading size="2xl" mb={4}>
            A Beautiful Custom Date Range Picker for Chakra UI
          </Heading>
          <Text fontSize="xl" color="gray.500">
            Fully customizable. No external calendar/time picker libraries.
          </Text>
  
          {/* Live demo */}
          <Box mt={10}>
            <Box
              display="inline-block"
              p={10}
              bg="gray.50"
              _dark={{ bg: "gray.700" }}
              borderRadius="md"
              boxShadow="lg"
            >
              <CustomDateRangePicker />
            </Box>
          </Box>
        </Container>
  
        <Divider my={10} />
  
        {/* -------- SOURCE CODE (GITHUB FETCH + EDITOR) -------- */}
        <Container maxW="5xl" py={10}>
          <Heading size="lg" mb={4}>
            Full Source Code (Editable)
          </Heading>
  
          <CodeViewer
            githubRawUrl="https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/src/components/DateTimePicker.jsx"
            showEditor={true}                     // user can edit code
            onCodeChange={(code) => setEditedCode(code)}
          />
  
          {/* Live Output Preview */}
          <Heading size="md" mt={10}>
            Output Preview
          </Heading>
  
          <LivePreview code={editedCode} />
        </Container>
  
        <Divider my={10} />
  
        {/* -------- FOOTER -------- */}
        <Box textAlign="center" py={10} color="gray.500">
          Built with ❤️ using Chakra UI
        </Box>
      </Box>
    );
  }
  