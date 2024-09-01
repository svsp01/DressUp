"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { User, CreditCard, Bell, Settings, LogOut, Edit3 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";

const ProfileScreen = ({ user }: any) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [editableUser, setEditableUser] = useState(user);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditableUser({ ...editableUser, [name]: value });
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setEditableUser(user);
    setIsEditing(false);
  };

  const handleSaveClick = () => {
    // Implement save functionality here (e.g., API call to update user profile)
    setIsEditing(false);
  };

  const renderField = (label: string, value: string, name: string) => (
    <div className="flex items-center space-x-4">
      <User className="text-blue-400" />
      <div>
        <p className="text-sm text-gray-400">{label}</p>
        {isEditing ? (
          <Input
            type="text"
            name={name}
            value={value}
            onChange={handleInputChange}
            className="border-none focus:ring-0 focus:outline-none bg-transparent p-0"
            onBlur={() => {}}
          />
        ) : (
          <p>{value}</p>
        )}
      </div>
      {isEditing && (
        <Edit3 className="text-gray-500 w-4 h-4 cursor-pointer" />
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.profileImageUrl} alt={user.username} />
              <AvatarFallback>{user.firstName[0]}{user.lastName[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold">{user.firstName} {user.lastName}</h1>
              <p className="text-gray-400">@{user.username}</p>
            </div>
          </div>
          {isEditing ? (
            <div className="flex space-x-2">
              <Button variant="outline" className="text-black" onClick={handleCancelClick}>Cancel</Button>
              <Button onClick={handleSaveClick} variant="ghost">Save Changes</Button>
            </div>
          ) : (
            <Button variant="outline" className="text-black" onClick={handleEditClick}>
              <Settings className="mr-2 text-black" /> Edit Profile
            </Button>
          )}
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-gray-800 text-white">
                <CardHeader>
                  <CardTitle>Profile Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {renderField("Full Name", `${editableUser.firstName} ${editableUser.lastName}`, "firstName")}
                  {renderField("Email", editableUser.email, "email")}
                  <div className="flex items-center space-x-4">
                    <CreditCard className="text-green-400" />
                    <div>
                      <p className="text-sm text-gray-400">Credit Limit</p>
                      <p>${10000}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-2">Credit Used</p>
                    <Progress value={(7500 / 10000) * 100} className="h-2 text-green-300" />
                    <p className="text-right text-sm mt-1">$7,500 / $10,000</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="subscription">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-gray-800">
                <CardHeader>
                  <CardTitle>Subscription Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400">Current Plan</p>
                    <p className="text-xl font-bold">Premium</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Next Billing Date</p>
                    <p>October 1, 2024</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">Manage Subscription</Button>
                </CardFooter>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="notifications">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-gray-800">
                <CardHeader>
                  <CardTitle>Recent Notifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { id: 1, title: "Credit Limit Alert", description: "You've used 75% of your credit limit." },
                    { id: 2, title: "Subscription Renewal", description: "Your subscription will renew in 7 days." },
                  ].map((notification) => (
                    <Alert key={notification.id} className="bg-gray-700">
                      <Bell className="h-4 w-4" />
                      <AlertTitle>{notification.title}</AlertTitle>
                      <AlertDescription>{notification.description}</AlertDescription>
                    </Alert>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="mt-8 bg-gray-800">
            <CardHeader>
              <CardTitle>Account Activity</CardTitle>
              <CardDescription>Recent login and account updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Last Login</p>
                    <p className="text-sm text-gray-400">{new Date(user.lastLogin).toLocaleString()}</p>
                  </div>
                  <Button variant="ghost" size="sm"><LogOut className="mr-2" /> Sign Out</Button>
                </div>
                <div>
                  <p className="font-medium">Account Created</p>
                  <p className="text-sm text-gray-400">{new Date(user.createdAt).toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfileScreen;
