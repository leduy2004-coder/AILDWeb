import classes from './SuccessToast.module.scss';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

type Props = {
  content: string;
};

export function SuccessToast({ content }: Props) {
  return (
    <div className={classes['container']}>
      <div className={classes['icon-container']}>
        <CheckCircleOutlineIcon style={{ color: '#3AC17A' }} />
      </div>

      <span className={classes['content']}>{content}</span>
    </div>
  );
}
