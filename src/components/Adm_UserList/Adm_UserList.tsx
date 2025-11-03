"use client";

import {
  Box,
  Paper,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import type { ApiResponse, UserList } from "@/types/api";
import getUsersList from "@/actions/admin/getUsersList";
import SearchBox from "../SearchBox";
import { Controller, useForm } from "react-hook-form";
import getSearchUsers from "@/actions/admin/getSearchUsers";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

type FormValues = {
  userSearchInput: string;
};

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`users-tabpanel-${index}`}
      aria-labelledby={`users-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `users-tab-${index}`,
    "aria-controls": `users-tabpanel-${index}`,
  };
}

function UserTable({ users }: { users: UserList[] }) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Created</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                {format(new Date(user.created_at), "PPp")}
              </TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

const Adm_UserList = () => {
    const [tabIndex, setTabIndex] = useState(0);
    const [users, setUsers] = useState<ApiResponse<UserList>>(null);
    const [loading, setLoading] = useState(true);

    const userSearchInput = "";

    const { handleSubmit, control, setValue } =
      useForm<FormValues>({
        defaultValues: {
          userSearchInput: "",
        },
    });
    
    const onSubmit = async (data: FormValues) => {
        const response = await getSearchUsers(data.userSearchInput);
        setUsers(response.data);
    };

    const loadUsers = async () => {
        try {
            const response = await getUsersList();
            setUsers(response.data);
        } catch (error) {
            console.error('Failed to load users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    useEffect(() => {
        setValue("userSearchInput", userSearchInput);
    }, [userSearchInput, setValue]);

    if (loading) {
        return <Typography>Loading user list...</Typography>;
    }

    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };

    const newUsers = users?.filter((user: UserList) => user.new_user_status === 1);
    const existingUsers = users?.filter((user: UserList) => user.new_user_status === 0);

    return (
        <>
            <Controller
            name="userSearchInput"
            control={control}
            defaultValue=""
            rules={{ required: false }}
            render={({ field }) => (
                <SearchBox
                {...field}
                sx={{
                    m: 2,
                    width: "calc(100% - 60px)",
                }}
                placeholder="Search users..."
                onSubmit={handleSubmit(onSubmit)} 
                />
            )}
            />

            <Box sx={{ width: "100%" }}>
                <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
                    <Tabs
                    value={tabIndex}
                    onChange={handleTabChange}
                    aria-label="user status tabs"
                    >
                    <Tab label="New Users" {...a11yProps(0)} />
                    <Tab label="Existing Users" {...a11yProps(1)} />
                    </Tabs>
                </Box>

                <TabPanel value={tabIndex} index={0}>
                    {newUsers?.length > 0 ? (
                        <UserTable users={newUsers} />
                    ) : (
                        <Typography>No new users found.</Typography>
                    )}
                </TabPanel>
            
                <TabPanel value={tabIndex} index={1}>
                    {existingUsers?.length > 0 ? (
                        <UserTable users={existingUsers} />
                    ) : (
                        <Typography>No existing users found.</Typography>
                    )}
                </TabPanel>
            </Box>
        </>
    );
};

export default Adm_UserList;
