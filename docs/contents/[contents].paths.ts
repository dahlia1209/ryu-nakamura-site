import { load } from '../src/data/contents.data'

export default {
    async paths() {
        const data=await load()
        return data.contents.map(x=>x.title_no).map(x=>{
            return { params: { contents: x.toString(),title:x.toString()}}
        })
    }
  }