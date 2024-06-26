import { screen } from "@testing-library/react"
import { Breadcrumb } from "../src"
import { render, testA11y } from "./core"

describe("Breadcrumb", () => {
  test("passes a11y test", async () => {
    await testA11y(
      <Breadcrumb.Root>
        <Breadcrumb.List>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="#">Link 1</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item>
            <Breadcrumb.Link href="#">Link 2</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item>
            <Breadcrumb.CurrentLink>Link 3</Breadcrumb.CurrentLink>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>,
    )
  })

  test("has the proper aria-attributes", () => {
    render(
      <Breadcrumb.Root>
        <Breadcrumb.List>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="#">Link 1</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item>
            <Breadcrumb.Link href="#">Link 2</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item>
            <Breadcrumb.CurrentLink>Link 3</Breadcrumb.CurrentLink>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>,
    )

    // surrounding `nav` has aria-label="breadcrumb"
    screen.getByLabelText("breadcrumb", { selector: "nav" })

    // `isCurrentPage` link has aria-current="page"
    const currentPageLink = screen.getByText("Link 3")
    expect(currentPageLink).toHaveAttribute("aria-current", "page")
  })

  test("separator can be changed", () => {
    render(
      <Breadcrumb.Root>
        <Breadcrumb.List>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="#">Link 1</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator>-</Breadcrumb.Separator>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="#">Link 2</Breadcrumb.Link>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>,
    )
    expect(screen.getAllByText("-")).toHaveLength(1)
  })

  test("breadcrumb link has its href attribute correctly set", () => {
    render(
      <Breadcrumb.Root>
        <Breadcrumb.List>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="#">Link 1</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.CurrentLink>Link 2</Breadcrumb.CurrentLink>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>,
    )

    const link = screen.getByText("Link 1")
    expect(link.getAttribute("href")).toBe("#")
  })

  test("current page link doesn't have href attribute set", () => {
    render(
      <Breadcrumb.Root>
        <Breadcrumb.List>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="#">Link 1</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.CurrentLink>Link 2</Breadcrumb.CurrentLink>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>,
    )

    const link = screen.getByText("Link 2")
    expect(link.getAttribute("href")).toBe(null)
  })
})
