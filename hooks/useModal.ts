import { Dispatch, SetStateAction, useCallback, useState } from 'react';

const useModal = (defaultIsOpen = false) => {
  const [isOpen, setIsOpen] = useState(defaultIsOpen);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return { isOpen, setIsOpen, open, close };
};

export type TModal = ReturnType<typeof useModal>;

export type TCustomModal = {
  isOpen: boolean;
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
  open?: () => void;
  close?: () => void;
};

export default useModal;
