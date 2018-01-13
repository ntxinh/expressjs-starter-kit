class FailResponse {
  constructor (build) {
    this.success = false
    this.content = build.content
    this.message = build.message || ''
  }
  static get Builder () {
    class Builder {
      withContent (content) {
        this.content = content
        return this
      }
      withMessage (message) {
        this.message = message
        return this
      }
      build () {
        return new FailResponse(this)
      }
    }
    return Builder
  }
}

module.exports = FailResponse
