import { useState } from "react";
import {
  Box,
  HStack,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Table,
  TableContainer,
  Tag,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import ReactPaginate from "react-paginate";
import Search from "../../../../assets/icon/Search";
import Check from "../../../../assets/icon/Check";
import DownIcon from "../../../../assets/icon/DownIcon";
import Filter from "../../../../assets/icon/Filter";
import SearchIconEmpty from "../../../../assets/icon/SearchIconEmpty.svg";
import OrdersIconEmptyState from "../../../../assets/icon/OrdersIconEmptyState.svg";
import EventCautionState from "../../../../assets/icon/EventCautionState.svg";
import MoreDetails from "../../../../assets/icon/MoreDetails.svg";
import {
  eventFilter,
  ordersTableData,
  ordersTableHead,
} from "../../../../utils/constants";
import EmptyState from "../../../../components/ui/EmptyState";
import { useNavigate } from "react-router-dom";
import MoreDetailsModal from "./MoreDetailsModal";

const OrdersTable = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedFilterIndex, setSelectedFilterIndex] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [request] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const itemsPerPage = 8;

  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const [paginatedData, setPaginatedData] = useState(
    ordersTableData.slice(startIndex, endIndex)
  );
  const [totalItems, setTotalItems] = useState(ordersTableData.length);
  const [totalPages, setTotalPages] = useState(
    Math.ceil(totalItems / itemsPerPage)
  );

  //   HANDLE PAGE CHANGE

  const handlePageChange = ({ selected }) => {
    const newStartIndex = selected * itemsPerPage;
    const newEndIndex = newStartIndex + itemsPerPage;

    setPaginatedData(ordersTableData.slice(newStartIndex, newEndIndex));
    setCurrentPage(selected);
  };

  //   HANDLE SEARCH

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();

    const filteredData = ordersTableData.filter(
      (item) =>
        item.eventTitle.toLowerCase().includes(searchTerm) ||
        item.eventCategory.toLowerCase().includes(searchTerm)
    );

    setSearch(searchTerm);
    setCurrentPage(0);
    setPaginatedData(filteredData.slice(0, itemsPerPage));
    setTotalItems(filteredData.length);
    setTotalPages(Math.ceil(filteredData.length / itemsPerPage));
  };

  //   HANDLE CLEAR SEARCH

  const handleClearSearch = () => {
    setSearch("");
    setCurrentPage(0);
    setPaginatedData(ordersTableData.slice(0, itemsPerPage));
    setTotalItems(ordersTableData.length);
    setTotalPages(Math.ceil(ordersTableData.length / itemsPerPage));
  };

  //   const handleFilterByStatus = () => {}

  // HANDLE MORE

  const handleMoreDetails = (item) => {
    setSelectedItem(item);
    onOpen(); // Open the modal
  };

  return (
    <Box px={[4, 8]}>
      <Stack
        direction={["column", "row"]}
        justifyContent="space-between"
        w="100%"
        spacing="24px"
        alignItems="flex-start"
        pt={8}
        pb={6}
      >
        <InputGroup maxW="375px" w="100%">
          <InputLeftElement pointerEvents="none">
            <Search />
          </InputLeftElement>
          <Input
            value={search}
            onChange={handleSearch}
            type="text"
            placeholder="Search for all events"
          />
        </InputGroup>
        <Menu>
          <MenuButton
            p={2}
            border="1px solid"
            borderColor="gray.300"
            transition="all 0.2s"
            borderRadius="md"
            _hover={{ bg: "gray.400" }}
          >
            <HStack spacing="8px">
              <Filter />
              <Text fontSize={14} fontWeight={600} color="gray.800">
                File
              </Text>{" "}
              <DownIcon />
            </HStack>
          </MenuButton>
          <MenuList>
            {eventFilter.map((filter, i) => (
              <MenuItem
                key={i}
                justifyContent="space-between"
                onClick={() => setSelectedFilterIndex(i)}
              >
                {filter.filter} {selectedFilterIndex === i && <Check />}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      </Stack>
      <Box border="1px" borderColor="gray.300" borderRadius={8} pb={4}>
        <HStack px={6} py={5}>
          {search === "" ? (
            <Text fontSize={18} fontWeight={600} color="gray.800">
              All events
            </Text>
          ) : (
            <Text fontSize={18} fontWeight={600} color="gray.800">
              Result for &quot;{search}&quot;
            </Text>
          )}
          <Tag
            py="2px"
            px={2}
            bgColor="gray.200"
            fontSize={12}
            fontWeight={500}
            color="gray.700"
          >
            {(paginatedData.length === 0 && search === "") ||
            (paginatedData.length === 0 && search !== "")
              ? "No order"
              : search !== ""
              ? `${paginatedData.length} orders`
              : `${ordersTableData.length} orders`}
          </Tag>
        </HStack>
        {request ? (
          <>
            {paginatedData.length !== 0 ? (
              <TableContainer>
                <Table variant="simple">
                  <Thead>
                    <Tr bgColor="gray.200">
                      {ordersTableHead.map((th, i) => (
                        <Th
                          textTransform="capitalize"
                          fontSize={12}
                          fontWeight={500}
                          color="gray.600"
                          borderBottom="1px solid"
                          borderColor="gray.300"
                          key={i}
                        >
                          {th.head}
                        </Th>
                      ))}
                    </Tr>
                  </Thead>
                  <Tbody fontSize="sm">
                    {paginatedData.map((td, i) => (
                      <Tr key={i}>
                        <Td color="gray.600" fontWeight={500}>
                          {td.orderId}
                        </Td>
                        <Td>
                          <HStack spacing={3}>
                            <Image
                              src={td.attendeeAvatar}
                              alt={td.attendeeName}
                              w={10}
                              h={10}
                            />
                            <Box>
                              <Text fontWeight={500} color="gray.800">
                                {td.attendeeName}
                              </Text>
                            </Box>
                          </HStack>
                        </Td>
                        <Td>
                          <HStack spacing={3}>
                            <Image
                              src={td.img}
                              alt={td.eventTitle}
                              w={10}
                              h={10}
                            />
                            <Box>
                              <Text fontWeight={500} color="gray.800">
                                {td.eventTitle}
                              </Text>
                              <Text color="gray.600">{td.eventCategory}</Text>
                            </Box>
                          </HStack>
                        </Td>
                        <Td color="gray.600" fontWeight={500}>
                          {td.ticketType}
                        </Td>
                        <Td color="gray.600" fontWeight={500}>
                          {td.ticketCost}
                        </Td>
                        <Td color="gray.600" fontWeight={500}>
                          {td.created}
                        </Td>
                        <Td>
                          <HStack
                            cursor="pointer"
                            onClick={() => handleMoreDetails(td)}
                            spacing={3}
                          >
                            <Image
                              src={MoreDetails}
                              alt="more details"
                              w={5}
                              h={5}
                            />
                            <Text fontWeight={600} color="gray.700">
                              More details
                            </Text>
                          </HStack>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            ) : search !== "" && paginatedData.length === 0 ? (
              <EmptyState
                maxW="350px"
                icon={SearchIconEmpty}
                title="No result"
                desc={
                  <Text fontSize={14} color="gray.600" textAlign="center">
                    Your search “{search}” did not match any order. Please try
                    again.
                  </Text>
                }
                outlineBtn="Clear search"
                primaryBtn="Refresh page"
                outlineOnClick={handleClearSearch}
                primaryOnClick={() => window.location.reload()}
              />
            ) : (
              <EmptyState
                maxW="350px"
                icon={OrdersIconEmptyState}
                title="No purchases yet on your events"
                desc={
                  <Text fontSize={14} color="gray.600" textAlign="center">
                    All orders made will live here for you to view and manage
                    effectively.
                  </Text>
                }
                outlineBtn="Need help?"
                primaryBtn="Create event"
                outlineOnClick={() => navigate("/need-help")}
                primaryOnClick={() => navigate("/create-event")}
              />
            )}
          </>
        ) : (
          <EmptyState
            icon={EventCautionState}
            title="Something went wrong"
            maxW="350px"
            desc={
              <Text fontSize={14} color="gray.600" textAlign="center">
                We had some trouble loading this page. Please refresh the page
                to try again or get in touch if the problem sticks around!
              </Text>
            }
            outlineBtn="Contact support"
            primaryBtn="Refresh page"
            outlineOnClick={() => navigate("/support")}
            primaryOnClick={() => window.location.reload()}
          />
        )}
        {paginatedData.length !== 0 && (
          <Box px={6} pt={3}>
            <ReactPaginate
              previousLabel={"Previous"}
              nextLabel={"Next"}
              breakLabel={"..."}
              pageCount={totalPages}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={handlePageChange}
              containerClassName={"pagination"}
              subContainerClassName={"pages pagination"}
              activeClassName={"active"}
            />
          </Box>
        )}
      </Box>
      <MoreDetailsModal
        isOpen={isOpen}
        onClose={onClose}
        selectedItem={selectedItem}
      />
    </Box>
  );
};

export default OrdersTable;
