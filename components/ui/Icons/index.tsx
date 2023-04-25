import Image from 'next/image';

import deleteIcon from 'public/svg/delete.svg';
import editIcon from 'public/svg/edit.svg';
import plusIcon from 'public/svg/plus.svg';

export const PlusIcon = () => <Image src={plusIcon} alt="+" />;
export const EditIcon = () => <Image src={editIcon} alt="edit" />;
export const DeleteIcon = () => <Image src={deleteIcon} alt="delete" />;

export const ArrowDownIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className="w-8 h-8"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
  </svg>
);
