import { AnyType } from '@/types/shared';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

const CustomFormLabel = styled((props: AnyType) => (
  <Typography
    variant="subtitle1"
    fontWeight={600}
    {...props}
    component="label"
    htmlFor={props.htmlFor}
  />
))(() => ({
  marginBottom: '5px',
  marginTop: '25px',
  display: 'block',
}));

export default CustomFormLabel;
