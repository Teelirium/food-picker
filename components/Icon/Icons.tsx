import { FC, SVGProps } from 'react';

type IconFC = FC<SVGProps<SVGSVGElement>>;

export const MagnifyingGlass: IconFC = (props) => (
  <svg
    aria-hidden="true"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const DoubleChevronLeft: IconFC = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="11 17 6 12 11 7" />
    <polyline points="18 17 13 12 18 7" />
  </svg>
);

export const DoubleChevronRight: IconFC = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="13 17 18 12 13 7" />
    <polyline points="6 17 11 12 6 7" />
  </svg>
);

export const ChevronLeft: IconFC = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

export const ChevronRight: IconFC = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

export const Trash: IconFC = (props) => (
  <svg viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M21.8327 12V25.3333H11.166V12H21.8327ZM19.8327 4H13.166L11.8327 5.33333H7.16602V8H25.8327V5.33333H21.166L19.8327 4ZM24.4993 9.33333H8.49935V25.3333C8.49935 26.8 9.69935 28 11.166 28H21.8327C23.2993 28 24.4993 26.8 24.4993 25.3333V9.33333Z"
      fill="white"
    />
  </svg>
);
