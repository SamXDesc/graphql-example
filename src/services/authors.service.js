import { RESTDataSource } from 'apollo-datasource-rest'

class AuthorsAPI extends RESTDataSource {
  constructor () {
    super()
    this.baseURL = 'http://localhost:3000/authors'
  }

  async retrieveOne (id) {
    return this.get(`/${id}`)
  }

  async retrieveMany (params = {}) {
    return this.get('/', params)
  }
}

export default AuthorsAPI
