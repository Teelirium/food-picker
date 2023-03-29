import Link from 'next/link';
import router from 'next/router';

import styles from './styles.module.scss';

type Props = {
  grade: string;
  selectedList: string;
};

const Navibar: React.FC<Props> = ({ grade, selectedList }) => {
  return <div>grade</div>;
};

export default Navibar;
