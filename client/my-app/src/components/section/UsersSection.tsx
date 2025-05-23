"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MoreHorizontal,
  Search,
  Shield,
  Star,
  User as UserIcon,
  UserCheck,
  UserPlus,
  UserX,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Sample user data
const sampleUsers = [
  {
    id: 1,
    name: "Olivia Davis",
    email: "olivia@example.com",
    role: "admin",
    status: "active",
    lastActive: "2 hours ago",
    avatar: "OD",
  },
  {
    id: 2,
    name: "Ethan Wilson",
    email: "ethan@example.com",
    role: "user",
    status: "active",
    lastActive: "5 minutes ago",
    avatar: "EW",
  },
  {
    id: 3,
    name: "Sophia Martinez",
    email: "sophia@example.com",
    role: "editor",
    status: "inactive",
    lastActive: "3 days ago",
    avatar: "SM",
  },
  {
    id: 4,
    name: "Liam Johnson",
    email: "liam@example.com",
    role: "user",
    status: "active",
    lastActive: "1 hour ago",
    avatar: "LJ",
  },
  {
    id: 5,
    name: "Emma Brown",
    email: "emma@example.com",
    role: "user",
    status: "active",
    lastActive: "Just now",
    avatar: "EB",
  },
  {
    id: 6,
    name: "Noah Williams",
    email: "noah@example.com",
    role: "editor",
    status: "active",
    lastActive: "30 minutes ago",
    avatar: "NW",
  },
  {
    id: 7,
    name: "Ava Jones",
    email: "ava@example.com",
    role: "user",
    status: "inactive",
    lastActive: "1 week ago",
    avatar: "AJ",
  },
  {
    id: 8,
    name: "Lucas Garcia",
    email: "lucas@example.com",
    role: "user",
    status: "active",
    lastActive: "4 hours ago",
    avatar: "LG",
  },
];

// Role badge components
const RoleBadge = ({ role }: { role: string }) => {
  switch (role) {
    case "admin":
      return (
        <Badge
          variant="outline"
          className="border-red-500/20 bg-red-500/10 text-red-500"
        >
          <Shield className="mr-1 h-3 w-3" />
          Admin
        </Badge>
      );
    case "editor":
      return (
        <Badge
          variant="outline"
          className="border-amber-500/20 bg-amber-500/10 text-amber-500"
        >
          <Star className="mr-1 h-3 w-3" />
          Editor
        </Badge>
      );
    default:
      return (
        <Badge
          variant="outline"
          className="border-blue-500/20 bg-blue-500/10 text-blue-500"
        >
          <UserIcon className="mr-1 h-3 w-3" />
          User
        </Badge>
      );
  }
};

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  return status === "active" ? (
    <Badge
      variant="outline"
      className="border-green-500/20 bg-green-500/10 text-green-500"
    >
      <div className="mr-1.5 h-1.5 w-1.5 rounded-full bg-green-500" />
      Active
    </Badge>
  ) : (
    <Badge
      variant="outline"
      className="border-gray-500/20 bg-gray-500/10 text-gray-500"
    >
      <div className="mr-1.5 h-1.5 w-1.5 rounded-full bg-gray-500" />
      Inactive
    </Badge>
  );
};

interface UsersSectionProps {
  mini?: boolean;
}

const UsersSection = ({ mini = false }: UsersSectionProps) => {
  const [users, setUsers] = useState(sampleUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [displayedUsers, setDisplayedUsers] = useState([...users]);

  // Apply filters
  const applyFilters = () => {
    let filtered = [...users];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Apply role filter
    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((user) => user.status === statusFilter);
    }

    setDisplayedUsers(filtered);
  };

  // Handle user activation/deactivation
  const toggleUserStatus = (id: number) => {
    setUsers(
      users.map((user) =>
        user.id === id
          ? {
              ...user,
              status: user.status === "active" ? "inactive" : "active",
            }
          : user,
      ),
    );
    applyFilters();
  };

  // Effect for filtering
  useState(() => {
    applyFilters();
  });

  // For mini view, only show top active users
  const usersToShow = mini
    ? displayedUsers.filter((user) => user.status === "active").slice(0, 5)
    : displayedUsers;

  return (
    <Card className="bg-card/50 border-manga-600/20 animate-fade-in shadow-lg backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold">
          {mini ? "Active Users" : "User Management"}
        </CardTitle>

        {!mini && (
          <div className="flex items-center space-x-2">
            <Button size="sm" className="bg-manga-600 hover:bg-manga-700">
              <UserPlus className="mr-1 h-4 w-4" />
              Add User
            </Button>
          </div>
        )}
      </CardHeader>

      {!mini && (
        <div className="flex flex-col items-start gap-3 px-6 pb-2 sm:flex-row sm:items-center">
          <div className="relative flex-grow">
            <Search className="text-muted-foreground absolute top-2.5 left-3 h-4 w-4" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                applyFilters();
              }}
              className="bg-muted/40 border-manga-600/20 pl-9"
            />
          </div>

          <div className="flex flex-wrap gap-2 sm:flex-nowrap">
            <Select
              value={roleFilter}
              onValueChange={(value) => {
                setRoleFilter(value);
                applyFilters();
              }}
            >
              <SelectTrigger className="bg-muted/40 border-manga-600/20 w-[120px]">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent className="bg-card/90 border-manga-600/40 backdrop-blur-xl">
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="editor">Editor</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value);
                applyFilters();
              }}
            >
              <SelectTrigger className="bg-muted/40 border-manga-600/20 w-[120px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-card/90 border-manga-600/40 backdrop-blur-xl">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      <CardContent>
        <div className="border-manga-600/20 overflow-hidden rounded-md border">
          <table className="w-full">
            <thead>
              <tr className="bg-manga-600/20">
                <th className="px-4 py-3 text-left">User</th>
                {!mini && <th className="px-4 py-3 text-left">Email</th>}
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Last Active</th>
                {!mini && (
                  <th className="w-[80px] px-4 py-3 text-right">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {usersToShow.map((user) => (
                <tr
                  key={user.id}
                  className="border-manga-600/10 hover:bg-manga-600/5 border-t"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="border-manga-600/20 h-8 w-8 border">
                        <AvatarImage
                          src={`https://avatar.vercel.sh/${user.email}?size=32`}
                        />
                        <AvatarFallback className="bg-manga-600/30 text-xs">
                          {user.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </td>
                  {!mini && <td className="px-4 py-3">{user.email}</td>}
                  <td className="px-4 py-3">
                    <RoleBadge role={user.role} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={user.status} />
                  </td>
                  <td className="text-muted-foreground px-4 py-3 text-sm">
                    {user.lastActive}
                  </td>
                  {!mini && (
                    <td className="px-4 py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="bg-card/90 border-manga-600/40 backdrop-blur-xl"
                        >
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <UserIcon className="mr-2 h-4 w-4" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => toggleUserStatus(user.id)}
                          >
                            {user.status === "active" ? (
                              <>
                                <UserX className="mr-2 h-4 w-4" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <UserCheck className="mr-2 h-4 w-4" />
                                Activate
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive focus:text-destructive">
                            <UserX className="mr-2 h-4 w-4" />
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!mini && (
          <div className="text-muted-foreground mt-4 flex items-center justify-between text-sm">
            <div>
              Showing {displayedUsers.length} of {users.length} users
            </div>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                1
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                2
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                3
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UsersSection;
