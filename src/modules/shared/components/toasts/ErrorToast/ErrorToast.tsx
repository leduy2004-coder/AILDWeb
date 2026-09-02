import classes from './ErrorToast.module.scss';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

type Props = {
  content: string;
};

export function ErrorToast({ content }: Props) {
  return (
    <div className={classes['container']}>
      <div className={classes['icon-container']}>
        <HighlightOffIcon style={{ color: '#cc3535ff' }} />
      </div>

      <span className={classes['content']}>{content}</span>
    </div>
  );
}
