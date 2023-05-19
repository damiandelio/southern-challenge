import styled from 'styled-components'

export const Card = styled.article`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  max-width: 50rem;
  min-height: 50rem;
  padding: 1rem;
  margin-top: 1rem;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 1rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`

export const CardTitle = styled.h3`
  font-size: 1.3rem;
  padding-bottom: 1rem;
`

export const CardDescription = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 1rem;
`
