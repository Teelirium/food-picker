import Link from 'next/link';
import styles from './styles.module.scss';
import router from 'next/router';

type Props = {
  class: string;
  selectedList: string;
};

const Navibar: React.FC<Props> = ({ class, selectedList }) => {
    return <>{class}</>
};

export default Navibar;