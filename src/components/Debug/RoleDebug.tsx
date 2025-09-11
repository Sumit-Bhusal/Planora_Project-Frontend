import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { getUserInfo } from "../../lib/cookies";
import Card from "../UI/Card";

const RoleDebug: React.FC = () => {
  const { user } = useAuth();
  const [tokenUser, setTokenUser] = useState<any>(null);

  useEffect(() => {
    const checkToken = async () => {
      const userFromToken = await getUserInfo();
      setTokenUser(userFromToken);
    };
    checkToken();
  }, []);

  return (
    <Card className="p-4 mb-4 bg-yellow-50 border-yellow-200">
      <h3 className="text-lg font-semibold mb-3 text-yellow-800">
        Debug Information
      </h3>

      <div className="space-y-2 text-sm">
        <div>
          <strong>Auth Context User:</strong>
          <pre className="bg-gray-100 p-2 mt-1 rounded text-xs overflow-auto">
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>

        <div>
          <strong>Token User:</strong>
          <pre className="bg-gray-100 p-2 mt-1 rounded text-xs overflow-auto">
            {JSON.stringify(tokenUser, null, 2)}
          </pre>
        </div>

        <div>
          <strong>Is Organizer (Auth Context):</strong>{" "}
          {user?.role === "organizer" ? "YES" : "NO"}
        </div>

        <div>
          <strong>Has Organizer Role (Token):</strong>{" "}
          {tokenUser?.roles?.includes("organizer") ? "YES" : "NO"}
        </div>

        <div>
          <strong>Current URL:</strong> {window.location.pathname}
        </div>
      </div>
    </Card>
  );
};

export default RoleDebug;
