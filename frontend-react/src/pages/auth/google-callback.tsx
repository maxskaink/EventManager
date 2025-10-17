import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axiosInstance from "../../services/api/axios-instance";

type Data = {
    access_token: string,
    user: any
}

function GoogleCallback() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Data>();
  const [user, setUser] = useState(null);
  const loc = useLocation();

  // On page load, we take "search" parameters
  // and proxy them to /api/auth/callback on our Laravel API
  useEffect(() => {
    const params = new URLSearchParams(loc.search);
    const code = params.get("code");
    axiosInstance.post<Data>("/api/auth/callback", { code }).then((res) => {
      setLoading(false);
      setData(res.data);
    });
  }, []);

  // Helper method to fetch User data for authenticated user
  // Watch out for "Authorization" header that is added to this call
  function fetchUserData() {
    axiosInstance.get("/api/user", {
      headers: {
        Authorization: "Bearer " + data?.access_token,
      },
    }).then((res) => {
        setLoading(false)
        setUser(res.data?.user || data)
    });
  }

  if (loading) {
    return <DisplayLoading />;
  } else {
    if (user != null) {
      return <DisplayData data={user} />;
    } else {
      return (
        <div>
          <DisplayData data={data} />
          <div style={{ marginTop: 10 }}>
            <button onClick={fetchUserData}>Fetch User</button>
          </div>
        </div>
      );
    }
  }
}

function DisplayLoading() {
  return <div>Loading....</div>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function DisplayData(data: any) {
  return (
    <div>
      <samp>{JSON.stringify(data, null, 2)}</samp>
    </div>
  );
}

export default GoogleCallback;
