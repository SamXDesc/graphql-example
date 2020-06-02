import { RESTDataSource } from 'apollo-datasource-rest'
import DataLoader from 'dataloader'

class AuthorsAPI extends RESTDataSource {
  constructor () {
    super()
    this.baseURL = 'http://localhost:3000/authors'
    this.loader = new DataLoader(async ids => {
      return await this.post('/show-many', {
        authors: ids // .sort()
      })
    })
  }

  async retrieveOne (id) {
    return this.get(`/${id}`)

    // return this.loader.load(id)
  }

  async retrieveMany (params = {}) {
    return this.get('/', params)
  }
}

export default AuthorsAPI
