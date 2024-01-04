import md5 from "md5";
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/Auth";
import logoimage from "../Admin/img/logo/attnlg.jpg";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Admin/css/ruang-admin.css";
import "../Admin/css/ruang-admin.min.css";

const Login = () => {
  const [userType, setUserType] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  
  const apicall = async (user) => {
    const url = "http://localhost:8010";
    const hashedPassword = md5(password);
    const response = await fetch(`${url}/api/login/${user}`, {
      method: "POST",
      body: JSON.stringify({
        email: emailAddress,
        password: hashedPassword,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Invalid Username/Password!");
    }
    const data = await response.json();
    return data;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let userTypePath;
      if (userType === "Administrator") {
        userTypePath = "admin";
      } else if (userType === "ClassTeacher") {
        userTypePath = "teacher";
      } else {
        throw new Error("Invalid user type"); // Optional: Add explicit handling for invalid user types
      }
    
      const data = await apicall(userTypePath);
      await authContext.setUser(data[0]);
      setEmailAddress("");
      setPassword("");
      setUserType("");
      navigate(`/${userTypePath}`);
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
    
  };

  console.log(userType);
  return (
    <>
      <div className="bg-gradient-login">
        {/* <!-- Login Content --> */}
        <div className="container-login">
          <div className="row justify-content-center">
            <div className="col-xl-10 col-lg-12 col-md-9">
              <div className="card shadow-sm my-5">
                <div className="card-body p-0">
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="login-form">
                        <h4 className="text-gray-600 fw-300" align="center">ATTENDANCE MANAGEMENT SYSTEM</h4>
                        <div className="text-center">
                          <img
                            src={logoimage}
                            alt="loading"
                            style={{ width: "100px", height: "100px" }}
                          />
                          <br />
                          <br />
                          <h4 className="text-gray-800 mb-4">LOG IN</h4>
                        </div>
                        <form
                          className="user"
                          autoComplete="on"
                          onSubmit={(e) => handleSubmit(e)}
                        >
                          <div className="form-group">
                            <select
                              required
                              name="userType"
                              className="form-control mb-3"
                              value={userType}
                              onChange={(e) => setUserType(e.target.value)}
                            >
                              <option value="">--Select User Roles--</option>
                              <option value="Administrator">
                                Administrator
                              </option>
                              <option value="ClassTeacher">ClassTeacher</option>
                            </select>
                          </div>
                          <div className="form-group">
                            <input
                              type="text"
                              className="form-control mb-3"
                              required
                              name="username"
                              id="exampleInputEmail"
                              placeholder="Enter Email Address"
                              value={emailAddress}
                              onChange={(e) => setEmailAddress(e.target.value)}
                            />
                          </div>
                          <div className="form-group">
                            <input
                              type="password"
                              name="password"
                              required
                              className="form-control mb-5"
                              id="exampleInputPassword"
                              placeholder="Enter Password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                            />
                          </div>

                          <div className="form-group">
                            <input
                              type="submit"
                              className="btn btn-success btn-block"
                              style={{ width: "100%" }}
                              value="Login"
                              name="login"
                            />
                          </div>
                        </form>

                        {error ? (
                          <div
                            className="alert alert-danger mt-3 p-2"
                            role="alert"
                          >
                            {error}
                          </div>
                        ) : (
                          ""
                        )}

                        <div className="text-center"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
