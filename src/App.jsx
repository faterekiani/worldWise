import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CitiesProvider } from "./contexts/CitiesContext";
import { AuthProvider } from "./contexts/FakeAuthContext";
import { Navigate } from "react-router-dom";

import HomePage from "./pages/HomePage";
import AppLayout from "./pages/AppLayout";
import CityList from "./components/CityList";
import CountryList from "./components/CountryList";
import Form from "./components/Form";
import City from "./components/City";
import Product from "./pages/Product";
import Pricing from "./pages/Pricing";
import Login from "./pages/Login";
import PageNotFound from "./pages/PageNotFound";
import ProtectedRoute from "./pages/ProtectedRoute";

export default function App() {
  return (
    <>
      <AuthProvider>
        <CitiesProvider>
          <BrowserRouter>
            <Routes>
              <Route index element={<HomePage />} />
              <Route
                path="app"
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate replace to="cities" />} />
                <Route path="cities" element={<CityList />} />
                <Route path="countries" element={<CountryList />} />{" "}
                <Route path="form" element={<Form />} />
                <Route path="cities/:id" element={<City />} />
              </Route>
              <Route path="product" element={<Product />} />
              <Route path="pricing" element={<Pricing />} />
              <Route path="login" element={<Login />} />
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </BrowserRouter>
        </CitiesProvider>
      </AuthProvider>
    </>
  );
}
