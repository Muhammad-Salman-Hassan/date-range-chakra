import {
    Box,
    Button,
    Code,
    Collapse,
    Flex,
    IconButton,
    useClipboard,
    Spinner,
  } from "@chakra-ui/react";
  import { FaCopy, FaCheck } from "react-icons/fa";
  import { useState, useEffect } from "react";
  import Editor from "react-simple-code-editor";
  import { highlight, languages } from "prismjs";
  import "prismjs/components/prism-javascript";
  import "prismjs/themes/prism-tomorrow.css";
  
  export default function CodeViewer({ githubRawUrl, showEditor = false, onCodeChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const [sourceCode, setSourceCode] = useState("");
    const [loading, setLoading] = useState(true);
  
    const { hasCopied, onCopy } = useClipboard(sourceCode);
  
    // Load code from GitHub raw URL
    useEffect(() => {
      if (!githubRawUrl) return;
      fetch(githubRawUrl)
        .then((res) => res.text())
        .then((text) => {
          setSourceCode(text);
          setLoading(false);
        });
    }, [githubRawUrl]);
  
    return (
      <Box>
        <Flex justify="flex-end" mb={3} gap={2}>
          <Button size="sm" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? "Hide Code" : "Show Code"}
          </Button>
  
          <IconButton
            size="sm"
            icon={hasCopied ? <FaCheck /> : <FaCopy />}
            colorScheme={hasCopied ? "green" : "gray"}
            onClick={onCopy}
          />
        </Flex>
  
        <Collapse in={isOpen} animateOpacity>
          <Box
            bg="gray.900"
            color="green.200"
            borderRadius="md"
            p={4}
            maxH="600px"
            overflow="auto"
          >
            {loading ? (
              <Spinner color="white" />
            ) : showEditor ? (
              <Editor
                value={sourceCode}
                onValueChange={(code) => {
                  setSourceCode(code);
                  onCodeChange?.(code);
                }}
                highlight={(code) => highlight(code, languages.js, "javascript")}
                padding={10}
                style={{
                  fontFamily: "monospace",
                  fontSize: 14,
                  color: "white",
                }}
              />
            ) : (
              <Code whiteSpace="pre" colorScheme="blackAlpha">
                {sourceCode}
              </Code>
            )}
          </Box>
        </Collapse>
      </Box>
    );
  }
  