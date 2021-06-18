import React, { useState, useEffect } from 'react'

const StripeScriptLoader = ({ children, uniqueId, script, loader }) => {
  const [stripeLoaded, setStripeLoaded] = useState({})
  useEffect(() => {
    const loadScript = (src, uniqueId) =>
      new Promise((resolve, reject) => {
        /** @type HTMLScriptElement */
        const scriptElement = document.getElementById(uniqueId)

        if (!scriptElement) {
          const script = document.createElement('script')
          script.src = src
          script.id = uniqueId

          const handleLoadScriptSuccess = () => {
            script.isLoaded = true;
            resolve({successful: true});
          }
          const handleLoadScriptFail = event => reject({ error: event })

          script.addEventListener('load', handleLoadScriptSuccess, {
            once: true,
          })
          script.addEventListener('error', handleLoadScriptFail, { once: true })
          document.head.appendChild(script)
        } else if (!scriptElement.isLoaded) {
          const handleLoadScriptSuccess = () => resolve({successful: true})
          scriptElement.addEventListener('load', handleLoadScriptSuccess, {
            once: true,
          })
        } else {
          resolve({ successful: true })
        }
      })
    const fetchData = async () => {
      const result = await loadScript(script, uniqueId)
      setStripeLoaded(result)
    }
    fetchData()
  }, [])

  return stripeLoaded.successful ? children : loader
}
export default StripeScriptLoader
