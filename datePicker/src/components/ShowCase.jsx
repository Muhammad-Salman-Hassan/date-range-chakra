import {
    Box,
    Flex,
    Heading,
    Text,
    Container,
    Divider,
    useColorMode,
    IconButton,
    Button,
    Link,
} from "@chakra-ui/react";

import CustomDateRangePicker from "./DateTimePicker";
import CodeViewer from "./CodeViewer";

import { FaMoon, FaSun } from "react-icons/fa";
import { useState } from "react";

export default function ShowcasePage() {
    const { colorMode, toggleColorMode } = useColorMode();
    const [selectedRange, setSelectedRange] = useState(null);

    const handleClear = () => setSelectedRange(null);
   
    return (
        <Box>
            
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

           
            <Container maxW="5xl" textAlign="center" py={20}>
                <Heading size="2xl" mb={4}>
                    A Beautiful Custom Date Range Picker for Chakra UI v2
                </Heading>
                <Text fontSize="xl" color="gray.500">
                    Fully customizable. 
                </Text>

                <Box mt={10}>
                    <Box
                        display="inline-block"
                        p={10}
                        bg="gray.50"
                        _dark={{ bg: "gray.700" }}
                        borderRadius="md"
                        boxShadow="lg"
                    >
                        <CustomDateRangePicker
                            onChange={(range) => {
                                setSelectedRange({
                                    start: range.start.format("YYYY-MM-DD HH:mm:ss"),
                                    end: range.end.format("YYYY-MM-DD HH:mm:ss")
                                });
                            }}
                        />

                        {selectedRange && (
                            <Box
                                mt={6}
                                p={4}
                                borderWidth="1px"
                                borderRadius="md"
                                bg="gray.100"
                                _dark={{ bg: "gray.600" }}
                            >
                                <Heading size="sm" mb={2}>Selected Range</Heading>
                                <Text><b>Start:</b> {selectedRange.start}</Text>
                                <Text><b>End:</b> {selectedRange.end}</Text>

                                <Button
                                    mt={3}
                                    size="sm"
                                    colorScheme="red"
                                    onClick={handleClear}
                                >
                                    Clear
                                </Button>
                            </Box>
                        )}
                    </Box>
                </Box>
            </Container>

            <Divider my={10} />

            {/* -------- USAGE EXAMPLE -------- */}
            <Container maxW="5xl" py={10}>
                <Heading size="lg" mb={4}>Usage Example</Heading>
                <Box
                    p={4}
                    borderWidth="1px"
                    borderRadius="md"
                    bg="gray.50"
                    _dark={{ bg: "gray.700" }}
                    fontFamily="monospace"
                    whiteSpace="pre-wrap"
                >
                    {`<CustomDateRangePicker
  onChange={(range) => {
    console.log(range.start.format("YYYY-MM-DD HH:mm:ss"), range.end.format("YYYY-MM-DD HH:mm:ss"));
  }}
    placement={"top"}
    showTime={true}
/>`}
                </Box>
            </Container>

            <Divider my={10} />

            {/* -------- CODE SECTION -------- */}
            <Container maxW="5xl" py={10}>
                <Heading size="lg" mb={4}>
                    Full Source Code (Editable)
                </Heading>

                <CodeViewer
                    githubRawUrl="https://raw.githubusercontent.com/Muhammad-Salman-Hassan/date-range-chakra/main/datePicker/src/components/DateTimePicker.jsx"
                    showEditor={true}
                />
            </Container>

            <Divider my={10} />

            {/* -------- FOOTER -------- */}
            <Box textAlign="center" py={10} color="gray.500">
                Built with ❤️ using Chakra UI <br/>
                <Link href="https://github.com/Muhammad-Salman-Hassan/date-range-chakra" color={"blue"}>Github</Link>
            </Box>
        </Box>
    );
}
