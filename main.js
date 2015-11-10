;(function (window, document) {
  'use strict'

  const githubApiRootUrl = 'https://api.github.com'
  const searchRepoSubpath = '/search/repositories'
  const githubAccessTokens = [
    '9aeb625c5882359161b4e000a1fae621f0365320',
    'ecd3eb65b8b886cef78a241fd9f6db5a1f8b1830',
    '56524f38e37009f89c8c47736c8697a290b480c9'
  ]

  /**
   * Returns a promise representing the result result (in string form)
   * of search GitHub repositories with a keyword.
   * @param {string} keyword
   * @param {string} token
   * @returns {Promise}
   */
  function searchGithub(keyword, token) {
    console.log(`using token ${token}`)
    return new Promise((resolve, reject) => {
      const url = `${githubApiRootUrl}${searchRepoSubpath}?q=${encodeURIComponent(keyword)}&access_token=${token}`
      const req = new XMLHttpRequest()
      req.open('GET', url)

      req.onload = () => {
        if (req.status === 200) {
          resolve(req.responseText)
        } else {
          reject(Error(req.response))
        }
      }
      req.onerror = () => {
        reject(Error('network error'))
      }

      req.send()
    })
  }

  /**
   * Fill targetDiv with contents of resultJson, displaying the search result
   * in a human-readable form
   * @param {object} resultJson
   * @param {object} targetDiv
   */
  function displayResult (resultJson, targetDiv) {
    targetDiv.innerHTML += `
      <div class='totalCount'>
        Total count: ${resultJson.total_count}
      </div>
    `

    for (let item of resultJson.items) {
      targetDiv.innerHTML += `
        <div class='projectTitle'>
          <a href=${item.html_url}>${item.full_name}</a>
        </div>
      `
    }
  }

  const btnSearch = document.getElementById('btnSearch')
  const inputKeyword = document.getElementById('inputKeyword')
  const divResult = document.getElementById('divResult')

  btnSearch.onclick = () => {
    const keyword = inputKeyword.textContent
    searchGithub(keyword, githubAccessTokens[0])
      .catch(error => {
        console.log(error)
        return searchGithub(keyword, githubAccessTokens[1])
      })
      .catch(error => {
        console.log(error)
        return searchGithub(keyword, githubAccessTokens[2])
      })
      .then(JSON.parse)
      .then(result => displayResult(result, divResult))
      .catch(error => console.error(error))
  }


}(window, window.document))