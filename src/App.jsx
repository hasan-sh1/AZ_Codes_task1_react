import { Fragment } from "react";
import "nouislider/dist/nouislider.css";
import "jsvectormap/dist/jsvectormap.min.css";
import "react-datepicker/dist/react-datepicker.min.css";
import '@/assets/scss/Default.scss';
import "@/assets/scss/Icons.scss";
import { BrowserRouter } from 'react-router-dom';
import AppProvidersWrapper from './components/AppProvidersWrapper';
import AllRoutes from './routes/Routes';

const App = () => {
  return (
    <BrowserRouter>
      <AppProvidersWrapper>
        <AllRoutes />
      </AppProvidersWrapper>
    </BrowserRouter>
  );
};

export default App;