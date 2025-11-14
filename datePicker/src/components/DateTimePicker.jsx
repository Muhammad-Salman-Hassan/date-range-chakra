import React, { useState, useRef, useEffect } from "react";
import {
    Box,
    Flex,
    Text,
    IconButton,
    Input,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverBody,
    useDisclosure,
    Button,
} from "@chakra-ui/react";

import moment from "moment";
import {
    MdCalendarMonth,
    MdOutlineCancel,
    MdOutlineKeyboardArrowLeft,
    MdOutlineKeyboardArrowRight,
    MdOutlineKeyboardDoubleArrowLeft,
    MdOutlineKeyboardDoubleArrowRight,
} from "react-icons/md";
import { AiOutlineSwapRight } from "react-icons/ai";

const TimeColumn = ({ value, onChange, max, label }) => {
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current && value !== null) {
            const itemHeight = 32;
            scrollRef.current.scrollTop = value * itemHeight - itemHeight * 2;
        }
    }, [value]);

    const items = Array.from({ length: max + 1 }, (_, i) => i);

    return (
        <Box flex="1">
            <Text fontSize="xs" textAlign="center" mb={2} fontWeight="semibold" color="gray.600">
                {label}
            </Text>
            <Box
                ref={scrollRef}
                h="200px"
                overflowY="auto"
                borderRadius="md"
                css={{
                    "&::-webkit-scrollbar": {
                        width: "6px",
                    },
                    "&::-webkit-scrollbar-track": {
                        background: "#f1f1f1",
                    },
                    "&::-webkit-scrollbar-thumb": {
                        background: "#888",
                        borderRadius: "3px",
                    },
                    "&::-webkit-scrollbar-thumb:hover": {
                        background: "#555",
                    },
                }}
            >
                {items.map((item) => (
                    <Box
                        key={item}
                        h="32px"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        cursor="pointer"
                        bg={value === item ? "transparent" : "transparent"}
                        color={value === item ? "#2563eb" : "black"}
                        fontWeight={value === item ? "bold" : "normal"}
                        _hover={{ bg: "gray.50" }}
                        onClick={() => onChange(item)}
                        fontSize="xs"
                    >
                        {String(item).padStart(2, "0")}
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

const TimePicker = ({ time, onChange }) => {
    const [hour, setHour] = useState(time?.hour() || 0);
    const [minute, setMinute] = useState(time?.minute() || 0);
    const [second, setSecond] = useState(time?.second() || 0);

    useEffect(() => {
        if (time) {
            setHour(time.hour());
            setMinute(time.minute());
            setSecond(time.second());
        }
    }, [time]);

    const handleChange = (type, value) => {
        let newTime = moment(time || moment());

        if (type === "hour") {
            setHour(value);
            newTime.hour(value);
        } else if (type === "minute") {
            setMinute(value);
            newTime.minute(value);
        } else if (type === "second") {
            setSecond(value);
            newTime.second(value);
        }

        onChange(newTime);
    };

    return (
        <Flex gap={2} bg="white" p={2} borderRadius="md">
            <TimeColumn
                value={hour}
                onChange={(v) => handleChange("hour", v)}
                max={23}
                label="Hour"
            />
            <TimeColumn
                value={minute}
                onChange={(v) => handleChange("minute", v)}
                max={59}
                label="Minute"
            />
            <TimeColumn
                value={second}
                onChange={(v) => handleChange("second", v)}
                max={59}
                label="Second"
            />
        </Flex>
    );
};

export default function CustomDateRangePicker({
    onChange,
    placement = "bottom-start",
    showTime = true,
}) {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [currentMonth, setCurrentMonth] = useState(moment());
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [hovered, setHovered] = useState(false);
    const [activeInput, setActiveInput] = useState("start"); 

    const daysOfWeek = moment.weekdaysShort();

    const handleInputClick = (type) => {
        setActiveInput(type);
        onOpen();
    };

    const selectDate = (day) => {
        if (activeInput === "start") {
            const newStart = moment(day)
                .hour(startDate?.hour() || 0)
                .minute(startDate?.minute() || 0)
                .second(startDate?.second() || 0);
            setStartDate(newStart);
        } else {
            const newEnd = moment(day)
                .hour(endDate?.hour() || 23)
                .minute(endDate?.minute() || 59)
                .second(endDate?.second() || 59);
            setEndDate(newEnd);
        }
    };

    const handleTimeChange = (newTime) => {
        if (activeInput === "start") {
            setStartDate(newTime);
        } else {
            setEndDate(newTime);
        }
    };

    const handleOk = () => {
        if (activeInput === "start") {
            onChange?.({ start: startDate, end: moment() });
            setActiveInput("end")
        } else {
            onChange?.({ end: endDate ,start: startDate});
            onClose();
        }
    };

    const formatDateTime = (date) => {
        if (!date) return "";
        return showTime
            ? date.format("YYYY-MM-DD HH:mm:ss")
            : date.format("YYYY-MM-DD");
    };

    const renderCalendar = (month) => {
        const startOfMonth = moment(month).startOf("month");
        const endOfMonth = moment(month).endOf("month");
        const gridStart = moment(startOfMonth).startOf("week");
        const gridEnd = moment(endOfMonth).endOf("week");

        const days = [];
        let day = moment(gridStart);

        while (day.isBefore(gridEnd)) {
            days.push(moment(day));
            day.add(1, "day");
        }

        return (
            <Box>
                <Flex wrap="wrap" w="280px">
                    {daysOfWeek.map((d) => (
                        <Box
                            key={d}
                            w="40px"
                            textAlign="center"
                            fontSize="12px"
                            fontWeight={"semibold"}
                            mb={1}
                            color="gray.600"
                        >
                            {d}
                        </Box>
                    ))}

                    {days.map((d, i) => {
                        const outside = d.month() !== month.month();
                        const isSelected =
                            (activeInput === "start" && startDate && d.isSame(startDate, "day")) ||
                            (activeInput === "end" && endDate && d.isSame(endDate, "day"));
                        const isStart = startDate && d.isSame(startDate, "day");
                        const isEnd = endDate && d.isSame(endDate, "day");
                        const inRange =
                            startDate &&
                            endDate &&
                            d.isAfter(startDate, "day") &&
                            d.isBefore(endDate, "day");

                        return (
                            <Box
                                key={i}
                                position="relative"
                                w="40px"
                                h="30px"
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                cursor="pointer"
                                onClick={() => selectDate(d)}
                            >
                                {inRange && (
                                    <Box position="absolute" inset="0" bg="blue.50" zIndex={0} />
                                )}

                                {(isStart || isEnd) && (
                                    <Box
                                        position="absolute"
                                        inset="0"
                                        bg="#2563eb"
                                        borderRadius="md"
                                        zIndex={1}
                                    />
                                )}

                                <Text
                                    fontSize="14px"
                                    zIndex={2}
                                    color={
                                        outside
                                            ? "gray.300"
                                            : isStart || isEnd
                                                ? "white"
                                                : isSelected
                                                    ? "#2563eb"
                                                    : "black"
                                    }
                                    fontWeight={isSelected || isStart || isEnd ? "bold" : "normal"}
                                >
                                    {d.date()}
                                </Text>
                            </Box>
                        );
                    })}
                </Flex>
            </Box>
        );
    };

    const currentTime = activeInput === "start" ? startDate : endDate;
    const handleMouseEnter = () => {
        setHovered(true)
    }
    const handleMouseLeave = () => {
        setHovered(false)
    }
    const handleClear = () => {
        setHovered(false)
        setCurrentMonth(moment())
        setStartDate(null)
        setEndDate(null)
        setActiveInput("start")

    }
    const isclearDate = startDate && endDate && hovered
    return (
        <>
            <Flex
                align="center"
                border="1px solid #d9d9d9"
                borderRadius="6px"
                overflow="hidden"
                h="30px"
                _hover={{ borderColor: "#4096ff" }}
                transition="all 0.2s"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <Flex flex="1" h="100%" align="center" position="relative">
                    <Input
                        value={formatDateTime(startDate)}
                        placeholder={showTime ? "Start date time" : "Start date"}
                        readOnly
                        onClick={() => handleInputClick("start")}
                        border="none"
                        h="100%"
                        paddingRight="0"
                        cursor="pointer"
                        _focus={{ boxShadow: "none" }}
                        borderBottom={activeInput === "start" && isOpen ? "2px solid #1890ff" : "none"}
                    />
                </Flex>

                <Flex
                    w="40px"
                    h="100%"
                    justify="center"
                    align="center"
                    borderLeft="1px solid #d9d9d9"
                    borderRight="1px solid #d9d9d9"
                    fontWeight="medium"
                    color="gray.400"
                    fontSize="14px"
                >
                    <AiOutlineSwapRight />
                </Flex>

                <Flex flex="1" h="100%" align="center" position="relative">
                    <Input
                        value={formatDateTime(endDate)}
                        placeholder={showTime ? "End date time" : "End date"}
                        readOnly
                        onClick={() => handleInputClick("end")}
                        border="none"
                        h="100%"
                        paddingLeft="8px"
                        paddingRight="35px"
                        cursor="pointer"
                        _focus={{ boxShadow: "none" }}
                        borderBottom={activeInput === "end" && isOpen ? "2px solid #1890ff" : "none"}
                    />
                    <Box position="absolute" right="10px" w="25px" h="25px" display={"flex"} justifyContent={"center"} alignItems={"center"}>
                        {isclearDate ? (
                            <MdOutlineCancel
                                color="#d9d9d9"
                                size={20}
                                style={{ cursor: "pointer" }}
                                onClick={handleClear}

                            />
                        ) : (
                            <MdCalendarMonth color="#d9d9d9" />
                        )}
                    </Box>

                </Flex>
            </Flex>

            <Popover
                isOpen={isOpen}
                onClose={onClose}
                placement={placement}
                
                strategy="fixed"
                modifiers={[
                    {
                        name: "preventOverflow",
                        enabled: true,
                        options: {
                            boundary: "viewport",
                            padding: 8,
                        },
                    },
                    {
                        name: "flip",
                        enabled: true,
                        options: {
                            fallbackPlacements: ["top-start", "bottom-end", "top-end"],
                        },
                    },
                ]}
            >
                <PopoverTrigger>
                    <Box />
                </PopoverTrigger>

                <PopoverContent
                    w={showTime ? "600px" : "350px"}
                    maxW="95vw"
                    boxShadow="lg"
                    border="1px solid #e8e8e8"
                    mt={8}
                >
                    <PopoverBody p={0}>
                        <Flex>
                         
                            <Box p={4} borderRight={showTime ? "1px solid #e8e8e8" : "none"}>
                                <Flex justify="space-between" align="center" mb={3}>
                                    <Flex gap={1}>
                                        <IconButton
                                            icon={<MdOutlineKeyboardDoubleArrowLeft />}
                                            size="xs"
                                            variant="ghost"
                                            aria-label="Previous Year"
                                            onClick={() =>
                                                setCurrentMonth(moment(currentMonth).subtract(1, "year"))
                                            }
                                        />
                                        <IconButton
                                            icon={<MdOutlineKeyboardArrowLeft />}
                                            size="xs"
                                            variant="ghost"
                                            aria-label="Previous Month"
                                            onClick={() =>
                                                setCurrentMonth(moment(currentMonth).subtract(1, "month"))
                                            }
                                        />
                                    </Flex>

                                    <Text fontWeight="semibold" fontSize="sm">
                                        {currentMonth.format("MMM YYYY")}
                                    </Text>

                                    <Flex gap={1}>
                                        <IconButton
                                            icon={<MdOutlineKeyboardArrowRight />}
                                            size="xs"
                                            variant="ghost"
                                            aria-label="Next Month"
                                            onClick={() =>
                                                setCurrentMonth(moment(currentMonth).add(1, "month"))
                                            }
                                        />
                                        <IconButton
                                            icon={<MdOutlineKeyboardDoubleArrowRight />}
                                            size="xs"
                                            variant="ghost"
                                            aria-label="Next Year"
                                            onClick={() =>
                                                setCurrentMonth(moment(currentMonth).add(1, "year"))
                                            }
                                        />
                                    </Flex>
                                </Flex>

                                {renderCalendar(currentMonth)}
                            </Box>

                         
                            {showTime && (
                                <Box p={2} w="280px">
                                    <Flex justify="center" align="center" mb={3} gap={2}>
                                        <Text fontSize="lg" fontWeight="bold">
                                            {currentTime?.format("HH:mm:ss") || "00:00:00"}
                                        </Text>
                                    </Flex>

                                    <TimePicker
                                        time={currentTime || moment()}
                                        onChange={handleTimeChange}
                                    />

                                    <Flex justify="flex-end" mt={4} gap={2}>
                                        <Button size="xs" onClick={onClose} bg="white" color={"black"}>
                                            Cancel
                                        </Button>
                                        <Button
                                            size="xs"
                                            bg={"#2563eb"}
                                            color={"white"}
                                            onClick={handleOk}

                                        >
                                            OK
                                        </Button>
                                    </Flex>
                                </Box>
                            )}
                        </Flex>
                    </PopoverBody>
                </PopoverContent>
            </Popover>
        </>
    );
}