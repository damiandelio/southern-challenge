import styled from 'styled-components'

export const FeedContainer = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 7rem 1rem 1rem 1rem;
`

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  width: 100%;
  height: 6rem;
  padding: 0 1rem;
  background: rgba(255, 255, 255, 0.95);
  border-bottom: 1px solid #bbb;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

  a {
    text-decoration: none;
  }
`

export const Nav = styled.nav`
  display: flex;

  div {
    display: flex;
    flex-direction: column;
    margin: 0 1rem;
  }
`
