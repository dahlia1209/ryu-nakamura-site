export default {
    paths() {
        return [1].map(x=>{
            return { params: { contents: x.toString(),title:x.toString()}}
            })
    }
  }