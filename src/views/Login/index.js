import React, { useState } from "react";
import {
  Window,
  WindowHeader,
  WindowContent,
  TextField,
  Button,
} from "react95";
import { useRecoilValue } from "recoil";

import ErrorPopup from "../../components/ErrorPopup";
import { useAuth } from "../../context/AuthContext";
import { apiLimit } from "../../store";

import "./styles.scss";

export default function Login({ onLogin }) {
  const limit = useRecoilValue(apiLimit);
  const { signIn, teamMembers } = useAuth();
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (limit.exceeded) {
      return setShowError(true);
    }

    if (!email || !password) {
      setErrorMessage("Please enter both email and password");
      setShowError(true);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await signIn(email, password);
      
      if (error) {
        setErrorMessage(error.message || "Login failed. Please try again.");
        setShowError(true);
      } else {
        console.log("Login successful. Team memberships:", teamMembers);
        onLogin();
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred");
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleErrorClose = () => {
    setShowError(false);
    setErrorMessage("");
  };

  return (
    <div className="flex justify-center items-center login">
      <Window
        shadow={true}
        className="flex-column windowFrame__inner login__window"
      >
        <WindowHeader className="flex items-center justify-between handle">
          <span>Welcome to our computer</span>
          <Button size={"sm"} square disabled={false} onClick={() => ""}>
            <span
              style={{
                fontWeight: "bold",
                transform: "translateY(-1px)",
              }}
            >
              x
            </span>
          </Button>
        </WindowHeader>
        <WindowContent>
          <div className="flex">
            <img
              src={require(`../../assets/password.png`)}
              alt=""
              className="pl1 pr3 pixelated login__image"
            />
            <div>
              <p className="pb2">Please log in</p>
              <div className="relative">
                <div className="flex pb1 login__input">
                  <p>User:</p>
                  <TextField 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="your@email.com"
                  />
                </div>
                <div className="flex login__input">
                  <p>Password</p>
                  <TextField 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="pl3 login__button">
              <Button onClick={handleLogin} disabled={loading}>
                {loading ? "Logging in..." : "Log in"}
              </Button>
            </div>
          </div>
        </WindowContent>
      </Window>

      {showError && (
        <ErrorPopup
          header="Error"
          dismissable={true}
          onDismiss={handleErrorClose}
        >
          <p>
            {limit.exceeded
              ? `Unfortunately you cannot access the system now because the API rate limit has been exceeded. Please try again after ${limit.resetAt}.`
              : errorMessage}
          </p>
        </ErrorPopup>
      )}
    </div>
  );
}
