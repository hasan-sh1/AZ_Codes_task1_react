import { LayoutProvider } from '@/context/useLayoutContext';
import { CookiesProvider } from 'react-cookie';

const AppProvidersWrapper = ({
  children
}) => {
  return (
    <CookiesProvider defaultSetOptions={{
      path: '/'
    }}>
      <LayoutProvider>
        {children}
      </LayoutProvider>
    </CookiesProvider>
  );
};

export default AppProvidersWrapper;