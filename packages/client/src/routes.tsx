import {MainPage} from './pages/Main'
import {SecondPage} from './pages/SecondPage'
import {NotFoundPage} from './pages/NotFound'

export const routes = [
  {
    path: "/",
    Component: MainPage,
  },
  {
    path: "/second",
    Component: SecondPage,
  },
  {
    path: "",
    Component: NotFoundPage,
  },
];
