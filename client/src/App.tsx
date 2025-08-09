import { Switch, Route } from "wouter";
import { Provider } from 'react-redux';
import { store } from './store';
import { ThemeProvider } from './components/Layout/ThemeProvider';
import Navigation from './components/Layout/Navigation';
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import CreateForm from './pages/CreateForm';
import PreviewForm from './pages/PreviewForm';
import MyForms from './pages/MyForms';
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={CreateForm} />
      <Route path="/create" component={CreateForm} />
      <Route path="/preview" component={PreviewForm} />
      <Route path="/myforms" component={MyForms} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider defaultTheme="light" storageKey="form-builder-theme">
        <TooltipProvider>
          <div className="min-h-screen bg-background">
            <Navigation />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
              <Router />
            </main>
          </div>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
