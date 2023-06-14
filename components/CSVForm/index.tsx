import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

import ThinButton from 'components/ThinButton';
import { ExcelIcon } from 'components/ui/Icons';

type Props = {
  url: string;
  fileName: string;
};

export default function CSVForm({ url, fileName }: Props) {
  const { register, handleSubmit } = useForm<{ csv: FileList }>();

  const sendCSVMutation = useMutation({
    async mutationFn(data: { csv: FileList }) {
      const formData = new FormData();
      formData.append('csv', data.csv[0]);
      return axios.post(url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob',
      });
    },
    onSuccess(resp) {
      const dlUrl = URL.createObjectURL(resp.data);
      const link = document.createElement('a');
      link.href = dlUrl;
      link.download = fileName;
      link.click();
      setTimeout(() => URL.revokeObjectURL(dlUrl), 0);
      toast.success('Данные импортированы успешно');
    },
    async onError(err: AxiosError) {
      console.error(err);
      const msg = await (err.response?.data as Blob).text();
      toast.error(msg);
    },
  });

  const onSubmit = handleSubmit((data) => {
    sendCSVMutation.mutate(data);
  });

  return (
    <div style={{ margin: 'auto', height: 'max-content', color: 'white' }}>
      <form onSubmit={onSubmit}>
        <input type="file" {...register('csv')} />
        <ThinButton type="submit">
          <ExcelIcon size={30} />
          <span>Загрузить CSV</span>
        </ThinButton>
      </form>
    </div>
  );
}
