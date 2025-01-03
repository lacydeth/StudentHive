import "./Title.css"
type TitleProp = {
    subTitle:string,
    title:string
  }
  const Title = (props: TitleProp) => {
    return (
      <div className='title-component'>
          <p>{props.subTitle}</p>
          <h2>{props.title}</h2>
      </div>
    )
  }
  
  export default Title