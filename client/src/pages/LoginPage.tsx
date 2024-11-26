// // import { useState } from "react";
// // import { useUser } from "@/hooks/use-user";
// // import { useLocation } from "wouter";
// // import { Button } from "@/components/ui/button";
// // import { Input } from "@/components/ui/input";
// // import { Label } from "@/components/ui/label";
// // import { useToast } from "@/hooks/use-toast";
// // import { ErrorBoundary } from "@/components/ErrorBoundary";

// // function LoginPageContent() {
// //   const { login } = useUser();
// //   const [, setLocation] = useLocation();
// //   const { toast } = useToast();
// //   const [isLoading, setIsLoading] = useState(false);
// //   const [formData, setFormData] = useState({
// //     username: "",
// //     password: "",
// //   });

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     setIsLoading(true);

// //     try {
// //       const result = await login(formData);
// //       if (result.ok) {
// //         toast({
// //           title: "Success",
// //           description: "Logged in successfully",
// //         });
// //         setLocation("/create");
// //       } else {
// //         toast({
// //           title: "Error",
// //           description: result.message || "Login failed",
// //           variant: "destructive",
// //         });
// //       }
// //     } catch (error) {
// //       toast({
// //         title: "Error",
// //         description: "An unexpected error occurred",
// //         variant: "destructive",
// //       });
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="container mx-auto py-8 px-4 min-h-[calc(100vh-4rem)]">
// //       <div className="max-w-md mx-auto space-y-8">
// //         <div className="text-center">
// //           <h1 className="text-3xl font-bold">Login</h1>
// //           <p className="text-muted-foreground mt-2">
// //             Welcome back! Please login to continue.
// //           </p>
// //         </div>

// //         <form onSubmit={handleSubmit} className="space-y-6">
// //           <div className="space-y-2">
// //             <Label htmlFor="username">Username</Label>
// //             <Input
// //               id="username"
// //               type="text"
// //               value={formData.username}
// //               onChange={(e) =>
// //                 setFormData((prev) => ({ ...prev, username: e.target.value }))
// //               }
// //               required
// //             />
// //           </div>

// //           <div className="space-y-2">
// //             <Label htmlFor="password">Password</Label>
// //             <Input
// //               id="password"
// //               type="password"
// //               value={formData.password}
// //               onChange={(e) =>
// //                 setFormData((prev) => ({ ...prev, password: e.target.value }))
// //               }
// //               required
// //             />
// //           </div>

// //           <Button type="submit" className="w-full" disabled={isLoading}>
// //             {isLoading ? "Logging in..." : "Login"}
// //           </Button>
// //         </form>

// //         <div className="text-center">
// //           <p className="text-sm text-muted-foreground">
// //             Don't have an account?{" "}
// //             <Button
// //               variant="link"
// //               className="p-0"
// //               onClick={() => setLocation("/RegisterPage")} // Link to register page
// //             >
// //               Register
// //             </Button>
// //           </p>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // function LoginPage() {
// //   return (
// //     <ErrorBoundary>
// //       <LoginPageContent />
// //     </ErrorBoundary>
// //   );
// // }

// // export default LoginPage;

// import { useState } from "react";
// import { useUserContainer } from "@/containers/UserContainer"; // Updated import
// import { useLocation } from "wouter";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { useToast } from "@/hooks/use-toast";
// import { useNavigate } from "react-router-dom";

// const LoginPage: React.FC = () => {
//   const { login } = useUserContainer(); // Updated
//   const [, setLocation] = useLocation();
//   const { toast } = useToast();
//   const [isLoading, setIsLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     username: "",
//     password: "",
//   });

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);

//     try {
//       const result = login({
//         username: formData.username,
//         password: formData.password,
//       });

//       if (result.ok) {
//         toast({
//           title: "Success",
//           description: "Logged in successfully!",
//         });
//         setLocation("/create"); // Navigate to the "CreatePage" or dashboard
//       } else {
//         toast({
//           title: "Error",
//           description: result.message || "Login failed",
//           variant: "destructive",
//         });
//       }
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "An unexpected error occurred",
//         variant: "destructive",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="container mx-auto py-8 px-4 min-h-[calc(100vh-4rem)]">
//       <div className="max-w-md mx-auto space-y-8">
//         <div className="text-center">
//           <h1 className="text-3xl font-bold">Login</h1>
//           <p className="text-muted-foreground mt-2">
//             Welcome back! Please login to continue.
//           </p>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="space-y-2">
//             <Label htmlFor="username">Username</Label>
//             <Input
//               id="username"
//               type="text"
//               value={formData.username}
//               onChange={(e) =>
//                 setFormData((prev) => ({ ...prev, username: e.target.value }))
//               }
//               required
//             />
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="password">Password</Label>
//             <Input
//               id="password"
//               type="password"
//               value={formData.password}
//               onChange={(e) =>
//                 setFormData((prev) => ({ ...prev, password: e.target.value }))
//               }
//               required
//             />
//           </div>

//           <Button type="submit" className="w-full" disabled={isLoading}>
//             {isLoading ? "Logging in..." : "Login"}
//           </Button>
//         </form>

//         <div className="text-center">
//           <p className="text-sm text-muted-foreground">
//             Don't have an account?{" "}
//             <Button
//               variant="link"
//               className="p-0"
//               onClick={() => setLocation("/RegisterPage")} // Navigate to the register page
//             >
//               Register
//             </Button>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;

// import { useState } from "react";
// import { useUserContainer } from "@/containers/UserContainer";
// import { useLocation, useNavigate } from "wouter"; // Import useNavigate
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { useToast } from "@/hooks/use-toast";

// const LoginPage: React.FC = () => {
//   const { login } = useUserContainer();
//   const [, setLocation] = useLocation(); // Keep useLocation for potential future use
//   const navigate = useNavigate(); // Initialize useNavigate
//   const { toast } = useToast();
//   const [isLoading, setIsLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     username: "",
//     password: "",
//   });

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);

//     try {
//       const result = await login({
//         username: formData.username,
//         password: formData.password,
//       });

//       if (result.ok) {
//         toast({
//           title: "Success",
//           description: "Logged in successfully!",
//         });
//         navigate("/create"); // Use navigate to go to /create
//       } else {
//         toast({
//           title: "Error",
//           description: result.message || "Login failed",
//           variant: "destructive",
//         });
//       }
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "An unexpected error occurred",
//         variant: "destructive",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="container mx-auto py-8 px-4 min-h-[calc(100vh-4rem)]">
//       <div className="max-w-md mx-auto space-y-8">
//         <div className="text-center">
//           <h1 className="text-3xl font-bold">Login</h1>
//           <p className="text-muted-foreground mt-2">
//             Enter your credentials to log in.
//           </p>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="space-y-2">
//             <Label htmlFor="username">Username</Label>
//             <Input
//               id="username"
//               type="text"
//               value={formData.username}
//               onChange={(e) =>
//                 setFormData((prev) => ({ ...prev, username: e.target.value }))
//               }
//               required
//             />
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="password">Password</Label>
//             <Input
//               id="password"
//               type="password"
//               value={formData.password}
//               onChange={(e) =>
//                 setFormData((prev) => ({ ...prev, password: e.target.value }))
//               }
//               required
//             />
//           </div>

//           <Button type="submit" className="w-full" disabled={isLoading}>
//             {isLoading ? "Logging in..." : "Login"}
//           </Button>
//         </form>

//         <div className="text-center">
//           <p className="text-sm text-muted-foreground">
//             Don't have an account?{" "}
//             <Button
//               variant="link"
//               className="p-0"
//               onClick={() => setLocation("/RegisterPage")}
//             >
//               Register
//             </Button>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;

// import { useState } from "react";
// import { useUser } from "@/hooks/use-user";
// import { useLocation } from "wouter";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { useToast } from "@/hooks/use-toast";
// // ... other imports

// import { Route } from "react-router-dom"; // Corrected import

// // ... rest of the component code
// import CreatePage from "@/pages/CreatePage";

// <Route path="/createpage" element={<CreatePage />} />


// const LoginPage: React.FC = () => {
//   const { login } = useUser();
//   const [, setLocation] = useLocation();
//   const { toast } = useToast();
//   const [isLoading, setIsLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);

//     try {
//       const result = await login({
//         email: formData.email,
//         password: formData.password,
//       });

//       if (result.ok) {
//         toast({
//           title: "Success",
//           description: "Logged in successfully!",
//         });
//         setLocation("/createpage"); // Redirects to the create page
//       } else {
//         toast({
//           title: "Error",
//           description: result.message || "Login failed",
//           variant: "destructive",
//         });
//       }
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "An unexpected error occurred",
//         variant: "destructive",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };


//   return (
//     <div className="container mx-auto py-8 px-4 min-h-[calc(100vh-4rem)]">
//       <div className="max-w-md mx-auto space-y-8">
//         <div className="text-center">
//           <h1 className="text-3xl font-bold">Login</h1>
//           <p className="text-muted-foreground mt-2">Sign in to your account.</p>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="space-y-2">
//             <Label htmlFor="email">Email</Label>
//             <Input
//               id="email"
//               type="email"
//               value={formData.email}
//               onChange={(e) =>
//                 setFormData((prev) => ({ ...prev, email: e.target.value }))
//               }
//               required
//             />
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="password">Password</Label>
//             <Input
//               id="password"
//               type="password"
//               value={formData.password}
//               onChange={(e) =>
//                 setFormData((prev) => ({ ...prev, password: e.target.value }))
//               }
//               required
//             />
//           </div>

//           <Button type="submit" className="w-full" disabled={isLoading}>
//             {isLoading ? "Logging in..." : "Login"}
//           </Button>
//         </form>

//         <div className="text-center">
//           <p className="text-sm text-muted-foreground">
//             Don't have an account?{" "}
//             <Button variant="link" className="p-0" asChild>
//               <a href="/RegisterPage">Register</a>
//             </Button>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;



import { useState } from "react";
import { useUser } from "@/hooks/use-user";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const LoginPage: React.FC = () => {
  const { login } = useUser();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await login({
        email: formData.email,
        password: formData.password,
      });

      if (result.ok) {
        toast({
          title: "Success",
          description: "Logged in successfully!",
        });
        setLocation("/CreatePage"); // Redirects to the create page
      } else {
        toast({
          title: "Error",
          description: result.message || "Login failed",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 min-h-[calc(100vh-4rem)]">
      <div className="max-w-md mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Login</h1>
          <p className="text-muted-foreground mt-2">Sign in to your account.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, password: e.target.value }))
              }
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Button variant="link" className="p-0" asChild>
              <a href="/register">Register</a>
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
