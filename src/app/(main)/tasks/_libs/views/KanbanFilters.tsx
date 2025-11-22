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
    <Card.Root mb="6" bg="bg" border={"none"} borderRadius="lg">
      <Card.Body p="4">
        <Flex direction="column" gap="4">
          <Flex gap="4" align="center" flexWrap="wrap">
            <HStack gap="2" flexShrink={0}>
              <Icon as={LuSearch} color="fg.muted" />
              <Input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                size="sm"
                w="200px"
                variant="outline"
              />
              {searchQuery && (
                <Icon
                  as={IoClose}
                  color="fg.muted"
                  cursor="pointer"
                  onClick={() => onSearchChange("")}
                  _hover={{ color: "fg" }}
                />
              )}
            </HStack>

            <Separator orientation="vertical" h="6" />

            <HStack gap="2" minW="200px" flexShrink={0}>
              <Icon as={FaRegFolder} color="fg.muted" />
              <Select.Root
                collection={projectCollection}
                value={selectedProject ? [selectedProject] : []}
                onValueChange={(details) => {
                  onProjectChange(details.value?.[0] || "");
                }}
                size="sm"
              >
                <Select.Trigger w="full">
                  <Select.ValueText
                    placeholder="All Projects"
                    color={selectedProject ? "fg" : "fg.muted"}
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
              <Icon as={LuUser} color="fg.muted" />
              <Select.Root
                collection={memberCollection}
                value={selectedMember ? [selectedMember] : []}
                onValueChange={(details) => {
                  onMemberChange(details.value?.[0] || "");
                }}
                size="sm"
              >
                <Select.Trigger w="full">
                  <Select.ValueText
                    placeholder="All"
                    color={selectedMember ? "fg" : "fg.muted"}
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
              <Icon as={LuCalendar} color="fg.muted" />
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
              <Text color="fg.muted" fontSize="sm">
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

          {hasActiveFilters && (
            <Flex
              gap="2"
              align="center"
              flexWrap="wrap"
              borderTop="1px solid"
              borderColor="border.subtle"
              pt="3"
            >
              <Text fontSize="sm" color="fg.muted" fontWeight="medium" mr="2">
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
                      _hover={{ color: "blue.600" }}
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
                      _hover={{ color: "blue.600" }}
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
                      _hover={{ color: "blue.600" }}
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
                      _hover={{ color: "blue.600" }}
                      size="xs"
                    />
                  </Badge>
                )}
              </Flex>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                color="fg.muted"
                _hover={{ bg: "bg.emphasized", color: "fg" }}
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
