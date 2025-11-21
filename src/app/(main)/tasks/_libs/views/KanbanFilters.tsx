"use client";
import React from "react";
import {
  Card,
  Flex,
  HStack,
  Select,
  Input,
  Badge,
  Button,
  Icon,
  Separator,
  Portal,
  Text,
  createListCollection,
} from "@chakra-ui/react";
import { FaRegFolder } from "react-icons/fa";
import { LuCalendar, LuSearch, LuUser } from "react-icons/lu";
import { IoClose } from "react-icons/io5";
import { formatDateRangeFilter } from "../../../../../lib/formatDate";

interface KanbanFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedProject: string;
  onProjectChange: (value: string) => void;
  selectedMember: string;
  onMemberChange: (value: string) => void;
  dateRange: { start: string; end: string };
  onDateRangeChange: (range: { start: string; end: string }) => void;
  projectOptions: { label: string; value: string }[];
  memberOptions: { label: string; value: string }[];
  selectedProjectName?: string;
  selectedMemberName?: string;
}

const KanbanFilters = ({
  searchQuery,
  onSearchChange,
  selectedProject,
  onProjectChange,
  selectedMember,
  onMemberChange,
  dateRange,
  onDateRangeChange,
  projectOptions,
  memberOptions,
  selectedProjectName,
  selectedMemberName,
}: KanbanFiltersProps) => {
  const hasActiveFilters =
    selectedProject ||
    selectedMember ||
    dateRange.start ||
    dateRange.end ||
    searchQuery;

  const projectCollection = createListCollection({ items: projectOptions });
  const memberCollection = createListCollection({ items: memberOptions });

  const handleClearAll = () => {
    onSearchChange("");
    onProjectChange("");
    onMemberChange("");
    onDateRangeChange({ start: "", end: "" });
  };

  return (
    <Card.Root mb="6" bg="white" border={"none"} borderRadius="lg">
      <Card.Body p="4">
        <Flex direction="column" gap="4">
          {/* Input Fields Row */}
          <Flex gap="4" align="center" flexWrap="wrap">
            <HStack gap="2" flexShrink={0}>
              <Icon as={LuSearch} color="gray.500" />
              <Input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                size="sm"
                w="200px"
                variant="outline"
                bg="white"
              />
              {searchQuery && (
                <Icon
                  as={IoClose}
                  color="gray.400"
                  cursor="pointer"
                  onClick={() => onSearchChange("")}
                  _hover={{ color: "gray.600" }}
                />
              )}
            </HStack>

            <Separator orientation="vertical" h="6" />

            <HStack gap="2" minW="200px" flexShrink={0}>
              <Icon as={FaRegFolder} color="gray.500" />
              <Select.Root
                collection={projectCollection}
                value={selectedProject ? [selectedProject] : []}
                onValueChange={(details) => {
                  onProjectChange(details.value?.[0] || "");
                }}
                size="sm"
              >
                <Select.Trigger w="full" bg="white">
                  <Select.ValueText
                    placeholder="All Projects"
                    color={selectedProject ? "gray.900" : "gray.500"}
                  />
                </Select.Trigger>
                <Portal>
                  <Select.Positioner>
                    <Select.Content>
                      {projectCollection.items.map((option) => (
                        <Select.Item key={option.value} item={option}>
                          {option.label}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Positioner>
                </Portal>
              </Select.Root>
            </HStack>

            <Separator orientation="vertical" h="6" />

            <HStack gap="2" minW="200px" flexShrink={0}>
              <Icon as={LuUser} color="gray.500" />
              <Select.Root
                collection={memberCollection}
                value={selectedMember ? [selectedMember] : []}
                onValueChange={(details) => {
                  onMemberChange(details.value?.[0] || "");
                }}
                size="sm"
              >
                <Select.Trigger w="full" bg="white">
                  <Select.ValueText
                    placeholder="All"
                    color={selectedMember ? "gray.900" : "gray.500"}
                  />
                </Select.Trigger>
                <Portal>
                  <Select.Positioner>
                    <Select.Content>
                      {memberCollection.items.map((option) => (
                        <Select.Item key={option.value} item={option}>
                          {option.label}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Positioner>
                </Portal>
              </Select.Root>
            </HStack>

            <Separator orientation="vertical" h="6" />

            <HStack gap="2" flexShrink={0}>
              <Icon as={LuCalendar} color="gray.500" />
              <Input
                type="date"
                value={dateRange.start}
                onChange={(e) =>
                  onDateRangeChange({ ...dateRange, start: e.target.value })
                }
                size="sm"
                w="150px"
                variant="outline"
                placeholder="Start date"
                max={dateRange.end}
              />
              <Text color="gray.400" fontSize="sm">
                to
              </Text>
              <Input
                type="date"
                value={dateRange.end}
                onChange={(e) =>
                  onDateRangeChange({ ...dateRange, end: e.target.value })
                }
                min={dateRange.start}
                size="sm"
                w="150px"
                variant="outline"
                placeholder="End date"
              />
            </HStack>
          </Flex>

          {/* Active Filters Row */}
          {hasActiveFilters && (
            <Flex
              gap="2"
              align="center"
              flexWrap="wrap"
              borderTop="1px solid"
              borderColor="gray.200"
              pt="3"
            >
              <Text fontSize="sm" color="gray.600" fontWeight="medium" mr="2">
                Active filters:
              </Text>
              <Flex gap="2" flexWrap="wrap" flex="1">
                {searchQuery && (
                  <Badge
                    colorPalette="blue"
                    variant="subtle"
                    px="2"
                    py="1"
                    borderRadius="full"
                    display="flex"
                    alignItems="center"
                    gap="1"
                  >
                    <Text fontSize="xs" whiteSpace="nowrap">
                      Search: {searchQuery}
                    </Text>
                    <Icon
                      as={IoClose}
                      cursor="pointer"
                      onClick={() => onSearchChange("")}
                      _hover={{ color: "blue.700" }}
                      size="xs"
                    />
                  </Badge>
                )}
                {selectedProject && (
                  <Badge
                    colorPalette="blue"
                    variant="subtle"
                    px="2"
                    py="1"
                    borderRadius="full"
                    display="flex"
                    alignItems="center"
                    gap="1"
                  >
                    <Text fontSize="xs" whiteSpace="nowrap">
                      {selectedProjectName}
                    </Text>
                    <Icon
                      as={IoClose}
                      cursor="pointer"
                      onClick={() => onProjectChange("")}
                      _hover={{ color: "blue.700" }}
                      size="xs"
                    />
                  </Badge>
                )}
                {selectedMember && (
                  <Badge
                    colorPalette="blue"
                    variant="subtle"
                    px="2"
                    py="1"
                    borderRadius="full"
                    display="flex"
                    alignItems="center"
                    gap="1"
                  >
                    <Text fontSize="xs" whiteSpace="nowrap">
                      {selectedMemberName}
                    </Text>
                    <Icon
                      as={IoClose}
                      cursor="pointer"
                      onClick={() => onMemberChange("")}
                      _hover={{ color: "blue.700" }}
                      size="xs"
                    />
                  </Badge>
                )}
                {(dateRange.start || dateRange.end) && (
                  <Badge
                    colorPalette="blue"
                    variant="subtle"
                    px="2"
                    py="1"
                    borderRadius="full"
                    display="flex"
                    alignItems="center"
                    gap="1"
                  >
                    <Text fontSize="xs" whiteSpace="nowrap">
                      {formatDateRangeFilter(dateRange.start, dateRange.end)}
                    </Text>
                    <Icon
                      as={IoClose}
                      cursor="pointer"
                      onClick={() => onDateRangeChange({ start: "", end: "" })}
                      _hover={{ color: "blue.700" }}
                      size="xs"
                    />
                  </Badge>
                )}
              </Flex>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                color="gray.600"
                _hover={{ bg: "gray.100", color: "gray.900" }}
                ml="auto"
                flexShrink={0}
              >
                Clear all
              </Button>
            </Flex>
          )}
        </Flex>
      </Card.Body>
    </Card.Root>
  );
};

export default KanbanFilters;
