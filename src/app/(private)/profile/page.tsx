import React, { useState } from 'react'
import ProfileScreen from './components/Profile'
import userServices from '@/services/userServices';

function Profile() {
  const user = {
    _id: "66d3fc82b04c02b6cb2efae8",
    username: "sakthi",
    email: "sakthi1@yopmail.com",
    firstName: "sakthi",
    lastName: "vignesh",
    password: "$2a$10$l674WAEOkeAEN56S1YkDu.Lp5BCVemKgu8nlW/PIdNlopCWll6vaW",
    phoneNumber: "09003817379",
    profileImageUrl: "https://picsum.photos/200/300.jpg",
    bio: "im a",
    createdAt: "2024-09-01T05:32:50.040+00:00",
    lastLogin: "2024-09-01T05:32:50.040+00:00",
    __v: 0
  }

  // const [userDetail, setUserDetail] = useState<Trend[]>([]);

  // const fetchTrends = async (page: number) => {
  //   try {
  //     const data = await userServices.getAllTrends(page, 10);

  //     console.log(data?.result, ">>>");
  //     setTrends(data?.result?.data);
  //     setHasMore(data?.result.hasMore);
  //   } catch (error) {
  //     console.error("Error fetching trends:", error);
  //     toast({
  //       title: "Error",
  //       description: "Unable to fetch trends data.",
  //     });
  //   }
  // };

  // useEffect(() => {
  //   fetchTrends(page);
  // }, [page]);

  return (
    <div><ProfileScreen user={user} /></div>
  )
}

export default Profile