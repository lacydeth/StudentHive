import styles from "./Title.module.css"

type TitleProp = {
    subTitle:string,
    title:string
}
const Title = (props: TitleProp) => {
    return (
      <div className={styles.title_component}>
          <p>{props.subTitle}</p>
          <h2>{props.title}</h2>
      </div>
    )
  }
  
  export default Title