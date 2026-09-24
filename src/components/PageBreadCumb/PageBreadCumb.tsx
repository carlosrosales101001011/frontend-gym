import { Helmet } from 'react-helmet';
import { useTitleStore } from '@/components/PageBreadCumb/useTitleStore';
import { useEffect } from 'react';

export const PageBreadCumb = ({title=''}) => {
  // const dispatch = useDispatch()
  const onChangeTitle = useTitleStore((state) => state.onChangeTitle);
  useEffect(() => {
    onChangeTitle(title)
  }, [title])
  
  return (
    <>
      <Helmet>
        <title>{title} | Sistema any</title>
      </Helmet>
    </>
  )
}
